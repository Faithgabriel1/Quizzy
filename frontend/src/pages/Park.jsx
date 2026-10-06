import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { startParking } from '../services/api'

export default function Park() {
  const navigate = useNavigate()
  const location = useLocation()
  const space = location.state?.space

  const [vehicleNumber, setVehicleNumber] = useState('')
  const [vehicleType, setVehicleType] = useState('Car')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

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

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!vehicleNumber.trim()) {
      setError('Please enter the vehicle number.')
      return
    }
    setSaving(true)
    try {
      const created = await startParking({
        plateNumber: vehicleNumber.trim(),
        vehicleType: vehicleType.toLowerCase(),
        ownerName: user.name || user.email,
        space,
      })
      // The dashboard uses this to show "your current parking".
      // TEMPORARY: replace with a per-user lookup when login is connected.
      localStorage.setItem(
        'session',
        JSON.stringify({
          sessionId: created._id,
          vehicleNumber: created.vehicle.plateNumber,
          vehicleType: created.vehicle.vehicleType,
          spaceNumber: created.parkingSpace.spaceNumber,
          location: created.parkingSpace.location,
          entryTime: created.entryTime,
        })
      )
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
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
        <button className="btn" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Confirm parking'}
        </button>
      </form>
      <Link to="/dashboard" className="back-link">Cancel</Link>
    </div>
  )
}