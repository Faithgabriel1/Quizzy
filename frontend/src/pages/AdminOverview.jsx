import { useEffect, useState } from 'react'
import { getSpaces } from '../services/api'

export default function AdminOverview() {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // TEMPORARY: read from the browser.
  // Replace with GET /api/parking-records and GET /api/payments when the backend is ready.
  const session = JSON.parse(localStorage.getItem('session') || 'null')
  const history = JSON.parse(localStorage.getItem('history') || '[]')

  useEffect(() => {
    getSpaces()
      .then(setSpaces)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const shown = spaces.map((s) =>
    session && s.spaceNumber === session.spaceNumber ? { ...s, status: 'occupied' } : s
  )
  const available = shown.filter((s) => s.status === 'available').length
  const occupied = shown.length - available
  const revenue = history.reduce((sum, r) => sum + r.amount, 0)
  const parkedNow = session ? [session] : []
  const recent = history.slice(0, 5)

  return (
    <div>
      <div className="dash-header">
        <h1>Admin overview</h1>
        <p>Spaces, vehicles and revenue at a glance.</p>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="stats four">
        <div className="stat"><strong>{shown.length}</strong><span>Total spaces</span></div>
        <div className="stat"><strong>{available}</strong><span>Available</span></div>
        <div className="stat"><strong>{occupied}</strong><span>Occupied</span></div>
        <div className="stat"><strong>₦{revenue.toLocaleString()}</strong><span>Revenue</span></div>
      </div>

      <h2 className="section-title">Currently parked vehicles</h2>
      {parkedNow.length === 0 ? (
        <div className="empty-state">No vehicles parked right now.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Space</th>
                <th>Entry time</th>
              </tr>
            </thead>
            <tbody>
              {parkedNow.map((p, i) => (
                <tr key={i}>
                  <td>{p.vehicleNumber}</td>
                  <td>{p.vehicleType}</td>
                  <td>{p.spaceNumber} - {p.location}</td>
                  <td>{new Date(p.entryTime).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="section-title" style={{ marginTop: 28 }}>Latest payments</h2>
      {recent.length === 0 ? (
        <div className="empty-state">No payments yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Space</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i}>
                  <td>{new Date(r.entryTime).toLocaleDateString()}</td>
                  <td>{r.vehicleNumber}</td>
                  <td>{r.spaceNumber}</td>
                  <td>₦{r.amount.toLocaleString()}</td>
                  <td>{r.paymentMethod}</td>
                  <td>{r.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}