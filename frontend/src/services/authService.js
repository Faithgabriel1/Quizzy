// Login and register calls. The backend answers { token, user } or { message } on errors.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function post(path, body) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

// Keeps the login in the browser so the rest of the app knows who is signed in.
function saveLogin({ token, user }) {
  const saved = { ...user, name: user.username }
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(saved))
  return saved
}

export async function login(email, password) {
  return saveLogin(await post('/auth/login', { email, password }))
}

export async function register(name, email, password) {
  return saveLogin(await post('/auth/register', { username: name, email, password }))
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
