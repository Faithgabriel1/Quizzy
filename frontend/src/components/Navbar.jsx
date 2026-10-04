import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  useLocation() // makes the navbar re-check login status on every page change

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  function logout() {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">ParkEase</Link>
      <nav>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className="link-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-small">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}