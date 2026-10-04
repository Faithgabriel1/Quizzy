import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

export default function Park() {
  const navigate = useNavigate()
  const location = useLocation()
  const space = location.state?.space

  const [vehicleNumber, setVehicleNumber] = useState('')
  const [vehicleType, setVehicleType] = useState('Car')
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user) return <Navigate to="/login" replace />

  // Opened without choosing a space first
  if (!space) {
    return (
      <div className="auth-card">
        <h1>Park a vehicle</h1>
        <p>Please pick an available space from the dashboard first.</p>
        <Link to="/dashboard" className="back-link">Go to dashboard</Link>
      </div>
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!vehicleNumber.trim()) {
      setError('Please enter the vehicle number.')
      return
    }
    // TEMPORARY: store the session locally.
    // Replace with POST /api/parking-records when Person 3's backend is ready.
    const session = {
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      vehicleType,
      spaceNumber: space.spaceNumber,
      location: space.location,
      entryTime: new Date().toISOString(),
    }
    localStorage.setItem('session', JSON.stringify(session))
    navigate('/dashboard')
  }

  return (
    <div className="auth-card">
      <h1>Park a vehicle</h1>
      <div className="chosen-space">
        Space <strong>{space.spaceNumber}</strong> - {space.location}
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Vehicle number</label>
          <input
            placeholder="e.g. ABC-123-XY"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Vehicle type</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
            <option>Car</option>
            <option>Motorcycle</option>
            <option>Truck</option>
          </select>
        </div>
        <button className="btn" type="submit">Confirm parking</button>
      </form>
      <Link to="/dashboard" className="back-link">Cancel</Link>
    </div>
  )
}