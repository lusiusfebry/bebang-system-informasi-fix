import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Welcome from './pages/Welcome'

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Welcome />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
