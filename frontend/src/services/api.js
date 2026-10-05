// All backend calls go through this file.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// The backend charges 500 per started hour (see completing a session).
export function calculateFee(hours) {
  const h = Math.max(1, Math.ceil(hours))
  return h * 500
}

// The backend answers { success, message, data }. This unwraps it and turns errors into messages.
async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || 'Something went wrong')
  return body.data
}

// ---- Parking spaces ----
export function getSpaces() {
  return request('/parking/spaces')
}

export function addSpace({ spaceNumber, location }) {
  return request('/parking/spaces', {
    method: 'POST',
    body: JSON.stringify({ spaceNumber, location }),
  })
}

export function updateSpaceStatus(id, status) {
  return request(`/parking/spaces/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export function deleteSpace(id) {
  return request(`/parking/spaces/${id}`, { method: 'DELETE' })
}

// ---- Parking sessions ----
async function findOrCreateVehicle({ plateNumber, vehicleType, ownerName }) {
  const plate = plateNumber.toUpperCase()
  const vehicles = await request('/vehicles')
  const existing = vehicles.find((v) => v.plateNumber === plate)
  if (existing) return existing
  return request('/vehicles', {
    method: 'POST',
    body: JSON.stringify({ plateNumber: plate, vehicleType, ownerName }),
  })
}

export async function startParking({ plateNumber, vehicleType, ownerName, space }) {
  const vehicle = await findOrCreateVehicle({ plateNumber, vehicleType, ownerName })
  return request('/parking/sessions', {
    method: 'POST',
    body: JSON.stringify({ vehicle: vehicle._id, parkingSpace: space._id }),
  })
}

export function completeSession(sessionId) {
  return request(`/parking/sessions/${sessionId}`, { method: 'PUT' })
}

// ---- Payments ----
export function recordPayment({ parkingSession, amount, paymentMethod }) {
  return request('/payments', {
    method: 'POST',
    body: JSON.stringify({
      parkingSession,
      amount,
      paymentMethod: paymentMethod.toLowerCase(),
    }),
  })
}