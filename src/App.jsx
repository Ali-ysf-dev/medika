import React, { useState } from 'react'
import './App.css'
import SideNavBar from './components/SideNavBar'
import MainContainer from './components/MainContainer'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <main className="h-screen w-[95%] bg-white p-8 mx-auto flex justify-between overflow-hidden">
      {isLoggedIn && <SideNavBar activeView={activeView} setActiveView={setActiveView} />}
      <MainContainer isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} activeView={activeView} setActiveView={setActiveView} />
    </main>
  )
}

export default App