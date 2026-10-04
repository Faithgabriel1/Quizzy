import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getSpaces, calculateFee } from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [now, setNow] = useState(Date.now())

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const session = JSON.parse(localStorage.getItem('session') || 'null')

  useEffect(() => {
    getSpaces()
      .then(setSpaces)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Refresh the clock every 30 seconds so duration and fee stay current
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])

  if (!user) return <Navigate to="/login" replace />

  // Mark the driver's own space as occupied
  const shown = spaces.map((s) =>
    session && s.spaceNumber === session.spaceNumber ? { ...s, status: 'occupied' } : s
  )
  const available = shown.filter((s) => s.status === 'available').length
  const occupied = shown.length - available

  function choose(space) {
    if (session) return
    if (space.status === 'available') navigate('/park', { state: { space } })
  }

  let minutes = 0
  let fee = 0
  if (session) {
    const elapsedMs = now - new Date(session.entryTime).getTime()
    minutes = Math.max(0, Math.floor(elapsedMs / 60000))
    fee = calculateFee(elapsedMs / 3600000)
  }

  return (
    <div>
      <div className="dash-header">
        <h1>Welcome{user.name ? `, ${user.name}` : ''}</h1>
        <p>Pick an available space to park your vehicle.</p>
      </div>

      {session && (
        <div className="session-card">
          <h2>Your current parking</h2>
          <div className="session-row"><span>Vehicle</span><strong>{session.vehicleNumber} ({session.vehicleType})</strong></div>
          <div className="session-row"><span>Space</span><strong>{session.spaceNumber} - {session.location}</strong></div>
          <div className="session-row"><span>Entry time</span><strong>{new Date(session.entryTime).toLocaleTimeString()}</strong></div>
          <div className="session-row"><span>Time parked</span><strong>{minutes} min</strong></div>
          <div className="session-row"><span>Estimated fee</span><strong>₦{fee.toLocaleString()}</strong></div>
          <button className="btn" onClick={() => navigate('/exit-summary')}>End parking</button>
        </div>
      )}

      <div className="stats">
        <div className="stat"><strong>{shown.length}</strong><span>Total spaces</span></div>
        <div className="stat"><strong>{available}</strong><span>Available</span></div>
        <div className="stat"><strong>{occupied}</strong><span>Occupied</span></div>
      </div>

      <h2 className="section-title">Parking spaces</h2>
      {session && <p className="notice">You already have an active parking session.</p>}
      {loading && <p>Loading spaces...</p>}
      {error && <p className="error">{error}</p>}

      <div className="space-grid">
        {shown.map((space) => (
          <div
            key={space._id}
            className={`space-card ${space.status}`}
            onClick={() => choose(space)}
          >
            <h3>{space.spaceNumber}</h3>
            <p>{space.location}</p>
            <span className={`badge ${space.status}`}>{space.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}