import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import MonsterCompendium from './MonsterCompendium'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monsters" element={<MonsterCompendium />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App