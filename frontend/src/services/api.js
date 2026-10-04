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

// TEMPORARY: while USE_MOCK is true, spaces are kept in the browser.
const SPACES_KEY = 'spaces'

function loadSpaces() {
  const stored = JSON.parse(localStorage.getItem(SPACES_KEY) || 'null')
  if (stored) return stored
  localStorage.setItem(SPACES_KEY, JSON.stringify(mockSpaces))
  return mockSpaces
}

function saveSpaces(spaces) {
  localStorage.setItem(SPACES_KEY, JSON.stringify(spaces))
}

export async function getSpaces() {
  if (USE_MOCK) return loadSpaces()
  const res = await fetch(`${API_URL}/parking-spaces`)
  if (!res.ok) throw new Error('Could not load parking spaces')
  return res.json()
}

export async function addSpace({ spaceNumber, location }) {
  if (USE_MOCK) {
    const spaces = loadSpaces()
    if (spaces.some((s) => s.spaceNumber.toLowerCase() === spaceNumber.toLowerCase())) {
      throw new Error('That space number already exists.')
    }
    const space = { _id: String(Date.now()), spaceNumber, location, status: 'available' }
    saveSpaces([...spaces, space])
    return space
  }
  const res = await fetch(`${API_URL}/parking-spaces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spaceNumber, location }),
  })
  if (!res.ok) throw new Error('Could not add the space')
  return res.json()
}

export async function updateSpaceStatus(id, status) {
  if (USE_MOCK) {
    saveSpaces(loadSpaces().map((s) => (s._id === id ? { ...s, status } : s)))
    return
  }
  const res = await fetch(`${API_URL}/parking-spaces/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Could not update the space')
}

export async function deleteSpace(id) {
  if (USE_MOCK) {
    saveSpaces(loadSpaces().filter((s) => s._id !== id))
    return
  }
  const res = await fetch(`${API_URL}/parking-spaces/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not delete the space')
}