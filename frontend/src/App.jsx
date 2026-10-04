import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Park from './pages/Park'
import ExitSummary from './pages/ExitSummary'
import History from './pages/History'

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/park" element={<Park />} />
          <Route path="/exit-summary" element={<ExitSummary />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </>
  )
}

export default App