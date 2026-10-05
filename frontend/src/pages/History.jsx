import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getPayments } from '../services/api'

export default function History() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPayments()
      .then(setHistory)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (!user) return <Navigate to="/login" replace />

  const total = history.reduce((sum, r) => sum + r.amount, 0)

  return (
    <div>
      <div className="dash-header">
        <h1>Parking history</h1>
        <p>Past parking sessions and payments.</p>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && history.length === 0 ? (
        <div className="empty-state">
          <p>No parking history yet.</p>
          <Link to="/dashboard" className="back-link">Go to dashboard</Link>
        </div>
      ) : (
        !loading &&
        !error && (
          <>
            <div className="stats">
              <div className="stat"><strong>{history.length}</strong><span>Sessions</span></div>
              <div className="stat"><strong>₦{total.toLocaleString()}</strong><span>Total paid</span></div>
              <div className="stat"><strong>{history[0].spaceNumber}</strong><span>Last space</span></div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Vehicle</th>
                    <th>Space</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((r) => (
                    <tr key={r.id}>
                      <td>{new Date(r.entryTime).toLocaleDateString()}</td>
                      <td>{r.vehicleNumber}</td>
                      <td>{r.spaceNumber}</td>
                      <td>{r.minutes !== null ? `${r.minutes} min` : '-'}</td>
                      <td>₦{r.amount.toLocaleString()}</td>
                      <td>{r.paymentMethod}</td>
                      <td>{r.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </div>
  )
}
