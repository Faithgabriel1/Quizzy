import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="hero">
      <h1>Park smarter with ParkEase</h1>
      <p>See available parking spaces, register your vehicle, and pay when you leave.</p>
      <div className="hero-actions">
        <Link to="/register" className="btn">Get Started</Link>
        <Link to="/login" className="btn btn-outline">Login</Link>
      </div>
    </section>
  )
}