import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { calculateFee } from '../services/api'

export default function ExitSummary() {
  const [exitTime] = useState(() => Date.now())
  const [method, setMethod] = useState('Cash')
  const [receipt, setReceipt] = useState(null)

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

  const elapsedMs = exitTime - new Date(session.entryTime).getTime()
  const minutes = Math.max(0, Math.floor(elapsedMs / 60000))
  const amount = calculateFee(elapsedMs / 3600000)

  function confirmPayment() {
    const record = {
      ...session,
      exitTime: new Date(exitTime).toISOString(),
      minutes,
      amount,
      paymentMethod: method,
      paymentStatus: 'paid',
    }
    // TEMPORARY: keep records in the browser.
    // Replace with PUT /api/parking-records/:id and POST /api/payments when the backend is ready.
    const history = JSON.parse(localStorage.getItem('history') || '[]')
    localStorage.setItem('history', JSON.stringify([record, ...history]))
    localStorage.removeItem('session')
    setReceipt(record)
  }

  return (
    <div className="auth-card">
      <h1>End parking</h1>
      <div className="session-row"><span>Vehicle</span><strong>{session.vehicleNumber}</strong></div>
      <div className="session-row"><span>Space</span><strong>{session.spaceNumber} - {session.location}</strong></div>
      <div className="session-row"><span>Entry time</span><strong>{new Date(session.entryTime).toLocaleTimeString()}</strong></div>
      <div className="session-row"><span>Exit time</span><strong>{new Date(exitTime).toLocaleTimeString()}</strong></div>
      <div className="session-row"><span>Time parked</span><strong>{minutes} min</strong></div>
      <div className="session-row"><span>Amount due</span><strong>₦{amount.toLocaleString()}</strong></div>

      <div className="form-group" style={{ marginTop: 18 }}>
        <label>Payment method</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>Cash</option>
          <option>Card</option>
          <option>Transfer</option>
        </select>
      </div>
      <button className="btn" onClick={confirmPayment}>Confirm payment</button>
      <Link to="/dashboard" className="back-link">Cancel</Link>
    </div>
  )
}