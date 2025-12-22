import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import XiaoPage from './pages/XiaoPage'
import AcousticalPage from './pages/AcousticalPage'
import BenadePage from './pages/BenadePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/flutecraft/" element={<Layout />}>
        <Route index element={<Navigate to="/flutecraft/acoustical/" replace />} />
        <Route path="/flutecraft/xiao/" element={<XiaoPage />} />
        <Route path="/flutecraft/acoustical/" element={<AcousticalPage />} />
        <Route path="/flutecraft/benade/" element={<BenadePage />} />
      </Route>
    </Routes>
  )
}

export default App
