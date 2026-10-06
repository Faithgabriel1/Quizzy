import { useEffect, useState } from 'react'
import { getSessions, getPayments } from '../services/api'

export default function AdminRecords() {
  const [search, setSearch] = useState('')
  const [sessions, setSessions] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getSessions(), getPayments()])
      .then(([se, pa]) => {
        setSessions(se)
        setPayments(pa)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Match each session with its payment (if it has one).
  const rows = sessions.map((s) => {
    const pay = payments.find((p) => p.sessionId === s.id)
    return {
      ...s,
      amount: pay ? pay.amount : s.status === 'completed' ? s.amount : null,
      paymentMethod: pay ? pay.paymentMethod : null,
      paymentStatus: pay ? pay.paymentStatus : s.status === 'active' ? 'parked' : 'unpaid',
    }
  })

  const term = search.trim().toLowerCase()
  const filtered = rows.filter(
    (r) =>
      !term ||
      r.vehicleNumber.toLowerCase().includes(term) ||
      r.spaceNumber.toLowerCase().includes(term)
  )
  const totalPaid = payments
    .filter((p) => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div>
      <div className="dash-header">
        <h1>Parking records</h1>
        <p>Every parking session and payment.</p>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="stats">
        <div className="stat"><strong>{rows.length}</strong><span>Total records</span></div>
        <div className="stat"><strong>{payments.length}</strong><span>Completed payments</span></div>
        <div className="stat"><strong>₦{totalPaid.toLocaleString()}</strong><span>Total paid</span></div>
      </div>

      <div className="form-group" style={{ maxWidth: 320 }}>
        <label>Search by vehicle or space</label>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. A01" />
      </div>

      {!loading && filtered.length === 0 ? (
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
              {filtered.map((r) => (
                <tr key={r.id}>
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
