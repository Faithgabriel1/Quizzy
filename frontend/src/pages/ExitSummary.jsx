import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { calculateFee, completeSession, recordPayment } from '../services/api'

export default function ExitSummary() {
  const [viewTime] = useState(() => Date.now())
  const [method, setMethod] = useState('Cash')
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const session = JSON.parse(localStorage.getItem('session') || 'null')

  if (!user) return <Navigate to="/login" replace />

  // After payment: show the receipt
  if (receipt) {
    return (
      <div className="auth-card">
        <h1>Payment complete</h1>
        <p className="success-text">Thank you. Your space is now free.</p>
        <div className="session-row"><span>Vehicle</span><strong>{receipt.vehicleNumber}</strong></div>
        <div className="session-row"><span>Space</span><strong>{receipt.spaceNumber}</strong></div>
        <div className="session-row"><span>Time parked</span><strong>{receipt.minutes} min</strong></div>
        <div className="session-row"><span>Amount paid</span><strong>₦{receipt.amount.toLocaleString()}</strong></div>
        <div className="session-row"><span>Method</span><strong>{receipt.paymentMethod}</strong></div>
        <Link to="/dashboard" className="btn" style={{ marginTop: 18, textAlign: 'center' }}>
          Back to dashboard
        </Link>
      </div>
    )
  }

  // No active session
  if (!session) {
    return (
      <div className="auth-card">
        <h1>Exit</h1>
        <p>You have no active parking session.</p>
        <Link to="/dashboard" className="back-link">Go to dashboard</Link>
      </div>
    )
  }

  // A session saved before the server was connected has no server ID
  if (!session.sessionId) {
    return (
      <div className="auth-card">
        <h1>Old session</h1>
        <p>This session was created before the server was connected, so it cannot be ended here.</p>
        <button
          className="btn"
          onClick={() => {
            localStorage.removeItem('session')
            window.location.href = '/dashboard'
          }}
        >
          Clear it
        </button>
      </div>
    )
  }

  const elapsedMs = viewTime - new Date(session.entryTime).getTime()
  const minutesNow = Math.max(0, Math.floor(elapsedMs / 60000))
  const estimate = calculateFee(elapsedMs / 3600000)

  async function confirmPayment() {
    setError('')
    setSaving(true)
    try {
      // 1. The server ends the session, works out the fee and frees the space
      const done = await completeSession(session.sessionId)
      // 2. Record the payment for that fee
      await recordPayment({
        parkingSession: session.sessionId,
        amount: done.amount,
        paymentMethod: method,
      })

      const minutes = Math.max(
        0,
        Math.floor((new Date(done.exitTime) - new Date(session.entryTime)) / 60000)
      )
      const record = {
        ...session,
        exitTime: done.exitTime,
        minutes,
        amount: done.amount,
        paymentMethod: method,
        paymentStatus: 'paid',
      }
      // TEMPORARY: history pages still read from the browser.
      // Replace with GET /api/payments when those pages are connected.
      const history = JSON.parse(localStorage.getItem('history') || '[]')
      localStorage.setItem('history', JSON.stringify([record, ...history]))
      localStorage.removeItem('session')
      setReceipt(record)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="auth-card">
      <h1>End parking</h1>
      <div className="session-row"><span>Vehicle</span><strong>{session.vehicleNumber}</strong></div>
      <div className="session-row"><span>Space</span><strong>{session.spaceNumber} - {session.location}</strong></div>
      <div className="session-row"><span>Entry time</span><strong>{new Date(session.entryTime).toLocaleTimeString()}</strong></div>
      <div className="session-row"><span>Time parked</span><strong>{minutesNow} min</strong></div>
      <div className="session-row"><span>Estimated amount</span><strong>₦{estimate.toLocaleString()}</strong></div>

      {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}

      <div className="form-group" style={{ marginTop: 18 }}>
        <label>Payment method</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>Cash</option>
          <option>Card</option>
          <option>Transfer</option>
        </select>
      </div>
      <button className="btn" onClick={confirmPayment} disabled={saving}>
        {saving ? 'Processing...' : 'Confirm payment'}
      </button>
      <Link to="/dashboard" className="back-link">Cancel</Link>
    </div>
  )
}