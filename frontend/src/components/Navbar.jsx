import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">ParkEase</Link>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/park">Park</Link>
        <Link to="/login">Login</Link>
        <Link to="/register" className="btn btn-small">Register</Link>
      </nav>
    </header>
  )
}