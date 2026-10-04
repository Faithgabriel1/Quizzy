import { useEffect, useState } from 'react'
import { getSpaces, addSpace, updateSpaceStatus, deleteSpace } from '../services/api'

export default function ManageSpaces() {
  const [spaces, setSpaces] = useState([])
  const [spaceNumber, setSpaceNumber] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')

  const session = JSON.parse(localStorage.getItem('session') || 'null')

  async function refresh() {
    try {
      setSpaces(await getSpaces())
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    if (!spaceNumber.trim() || !location.trim()) {
      setError('Please enter a space number and a location.')
      return
    }
    try {
      await addSpace({ spaceNumber: spaceNumber.trim().toUpperCase(), location: location.trim() })
      setSpaceNumber('')
      setLocation('')
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleStatus(id, status) {
    setError('')
    try {
      await updateSpaceStatus(id, status)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(space) {
    setError('')
    if (session && session.spaceNumber === space.spaceNumber) {
      setError('That space has a vehicle parked in it right now.')
      return
    }
    if (!window.confirm(`Delete space ${space.spaceNumber}?`)) return
    try {
      await deleteSpace(space._id)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="dash-header">
        <h1>Manage spaces</h1>
        <p>Add, update or remove parking spaces.</p>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="inline-form" onSubmit={handleAdd}>
        <div className="form-group">
          <label>Space number</label>
          <input placeholder="e.g. C01" value={spaceNumber} onChange={(e) => setSpaceNumber(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input placeholder="e.g. Second Floor" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <button className="btn" type="submit">Add space</button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Space</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map((s) => (
              <tr key={s._id}>
                <td>{s.spaceNumber}</td>
                <td>{s.location}</td>
                <td>
                  <select value={s.status} onChange={(e) => handleStatus(s._id, e.target.value)}>
                    <option value="available">available</option>
                    <option value="occupied">occupied</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(s)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}