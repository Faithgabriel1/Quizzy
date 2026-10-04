// All backend calls go through this file.
// When the real API is ready, set USE_MOCK = false and fix the endpoints here.
const USE_MOCK = true
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// PLACEHOLDER fee rule from the guide: confirm with the team.
export function calculateFee(hours) {
  const h = Math.max(1, Math.ceil(hours))
  return 500 + (h - 1) * 300
}

const mockSpaces = [
  { _id: '1', spaceNumber: 'A01', location: 'Ground Floor', status: 'available' },
  { _id: '2', spaceNumber: 'A02', location: 'Ground Floor', status: 'occupied' },
  { _id: '3', spaceNumber: 'A03', location: 'Ground Floor', status: 'available' },
  { _id: '4', spaceNumber: 'B01', location: 'First Floor', status: 'available' },
  { _id: '5', spaceNumber: 'B02', location: 'First Floor', status: 'occupied' },
  { _id: '6', spaceNumber: 'B03', location: 'First Floor', status: 'available' },
]

export async function getSpaces() {
  if (USE_MOCK) return mockSpaces
  const res = await fetch(`${API_URL}/parking-spaces`)
  if (!res.ok) throw new Error('Could not load parking spaces')
  return res.json()
}