import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Arti from './pages/Arti'
import Visi from './pages/Visi'
import Prideti from './pages/Prideti'
import Issaugoti from './pages/Issaugoti'
import Profilis from './pages/Profilis'
import Login from './pages/Login'
import Register from './pages/Register'
import EventDetail from './pages/EventDetail'
import EditEvent from './pages/EditEvent'
import Layout from './components/Layout'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Arti />} />
          <Route path="visi"        element={<Visi />} />
          <Route path="prideti"     element={<Prideti />} />
          <Route path="issaugoti"   element={<Issaugoti />} />
          <Route path="profilis"    element={<Profilis />} />
          <Route path="event/:id"   element={<EventDetail />} />
          <Route path="event/:id/edit" element={<EditEvent />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App