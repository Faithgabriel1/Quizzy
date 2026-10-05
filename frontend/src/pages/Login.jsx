import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    // TEMPORARY: fake login. Replace with POST /api/auth/login when Person 2's auth is ready.
    localStorage.setItem('user', JSON.stringify({ email }))
    navigate('/dashboard')
  }

  return (
    <div className="auth-card">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn" type="submit">Login</button>
      </form>
      <p className="auth-switch">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}