import { Link, Navigate } from 'react-router-dom'

export default function History() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user) return <Navigate to="/login" replace />

  // TEMPORARY: read from the browser.
  // Replace with GET /api/parking-records when the backend is ready.
  const history = JSON.parse(localStorage.getItem('history') || '[]')
  const total = history.reduce((sum, r) => sum + r.amount, 0)

  return (
    <div>
      <div className="dash-header">
        <h1>Parking history</h1>
        <p>Your past parking sessions and payments.</p>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No parking history yet.</p>
          <Link to="/dashboard" className="back-link">Go to dashboard</Link>
        </div>
      ) : (
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
                {history.map((r, i) => (
                  <tr key={i}>
                    <td>{new Date(r.entryTime).toLocaleDateString()}</td>
                    <td>{r.vehicleNumber}</td>
                    <td>{r.spaceNumber}</td>
                    <td>{r.minutes} min</td>
                    <td>₦{r.amount.toLocaleString()}</td>
                    <td>{r.paymentMethod}</td>
                    <td>{r.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}