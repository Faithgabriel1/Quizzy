import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getSpaces } from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    getSpaces()
      .then(setSpaces)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Not logged in: send to login page
  if (!user) return <Navigate to="/login" replace />

  const available = spaces.filter((s) => s.status === 'available').length
  const occupied = spaces.length - available

  function choose(space) {
    if (space.status === 'available') navigate('/park', { state: { space } })
  }

  return (
    <div>
      <div className="dash-header">
        <h1>Welcome{user.name ? `, ${user.name}` : ''}</h1>
        <p>Pick an available space to park your vehicle.</p>
      </div>

      <div className="stats">
        <div className="stat"><strong>{spaces.length}</strong><span>Total spaces</span></div>
        <div className="stat"><strong>{available}</strong><span>Available</span></div>
        <div className="stat"><strong>{occupied}</strong><span>Occupied</span></div>
      </div>

      <h2 className="section-title">Parking spaces</h2>
      {loading && <p>Loading spaces...</p>}
      {error && <p className="error">{error}</p>}

      <div className="space-grid">
        {spaces.map((space) => (
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