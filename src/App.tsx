import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Lenis from 'lenis'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FloatingChatWidget from './components/chat/FloatingChatWidget'

// Pages
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import Resources from './pages/Resources'
import About from './pages/About'
import Careers from './pages/Careers'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Dashboard from './pages/dashboard/Index'

function App() {
  useEffect(() => {
    // Initialize smooth scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
      <FloatingChatWidget />
    </div>
  )
}

export default App
