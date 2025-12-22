import { Routes, Route, Navigate } from 'react-router-dom'
import LayoutSingle from './components/Layout/LayoutSingle'
import XiaoPage from './pages/XiaoPage'
import AcousticalPage from './pages/AcousticalPage'
import BenadePage from './pages/BenadePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutSingle />}>
        <Route index element={<Navigate to="/acoustic" replace />} />
        <Route path="/xiao" element={<XiaoPage />} />
        <Route path="/acoustic" element={<AcousticalPage />} />
        <Route path="/benade" element={<BenadePage />} />
      </Route>
    </Routes>
  )
}

export default App
