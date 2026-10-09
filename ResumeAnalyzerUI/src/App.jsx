import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnalysisProvider } from './context/AnalysisContext'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AnalysisProvider>
  )
}
