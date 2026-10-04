import { useState } from 'react'

export default function AdminRecords() {
  const [search, setSearch] = useState('')

  // TEMPORARY: read from the browser.
  // Replace with GET /api/parking-records and GET /api/payments when the backend is ready.
  const session = JSON.parse(localStorage.getItem('session') || 'null')
  const history = JSON.parse(localStorage.getItem('history') || '[]')

  const rows = [
    ...(session
      ? [{ ...session, exitTime: null, minutes: null, amount: null, paymentMethod: null, paymentStatus: 'parked' }]
      : []),
    ...history,
  ]

  const term = search.trim().toLowerCase()
  const filtered = rows.filter(
    (r) =>
      !term ||
      r.vehicleNumber.toLowerCase().includes(term) ||
      r.spaceNumber.toLowerCase().includes(term)
  )
  const totalPaid = history.reduce((sum, r) => sum + r.amount, 0)

  return (
    <div>
      <div className="dash-header">
        <h1>Parking records</h1>
        <p>Every parking session and payment.</p>
      </div>

      <div className="stats">
        <div className="stat"><strong>{rows.length}</strong><span>Total records</span></div>
        <div className="stat"><strong>{history.length}</strong><span>Completed payments</span></div>
        <div className="stat"><strong>₦{totalPaid.toLocaleString()}</strong><span>Total paid</span></div>
      </div>

      <div className="form-group" style={{ maxWidth: 320 }}>
        <label>Search by vehicle or space</label>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. A01" />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No records found.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Space</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <td>{new Date(r.entryTime).toLocaleDateString()}</td>
                  <td>{r.vehicleNumber}</td>
                  <td>{r.vehicleType}</td>
                  <td>{r.spaceNumber}</td>
                  <td>{new Date(r.entryTime).toLocaleTimeString()}</td>
                  <td>{r.exitTime ? new Date(r.exitTime).toLocaleTimeString() : '-'}</td>
                  <td>{r.minutes !== null ? `${r.minutes} min` : '-'}</td>
                  <td>{r.amount !== null ? `₦${r.amount.toLocaleString()}` : '-'}</td>
                  <td>{r.paymentMethod || '-'}</td>
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