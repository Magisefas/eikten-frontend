import { Routes, Route } from 'react-router-dom'
import Arti from './pages/Arti'
import Visi from './pages/Visi'
import Prideti from './pages/Prideti'
import Issaugoti from './pages/Issaugoti'
import Profilis from './pages/Profilis'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Arti />} />
        <Route path="visi" element={<Visi />} />
        <Route path="prideti" element={<Prideti />} />
        <Route path="issaugoti" element={<Issaugoti />} />
        <Route path="profilis" element={<Profilis />} />
      </Route>
    </Routes>
  )
}

export default App