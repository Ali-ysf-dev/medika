import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import NavLink from './NavLink'
import logo from '../assets/logo.jpeg'

const SideNavBar = ({ activeView, setActiveView }) => {
  const navRef = useRef(null)

  useLayoutEffect(() => {
    if (navRef.current) {
      // Set initial position immediately (off-screen to the left) - runs before paint
      gsap.set(navRef.current, {
        x: -250,
        opacity: 0,
        scale: 0.95
      })
      
      // Animate in from left to right
      gsap.to(navRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.7
      })
    }
  }, [])

  return (
    <nav 
      ref={navRef}
      style={{ opacity: 0, transform: 'translateX(-250px) scale(0.95)' }}
      className="flex flex-col items-center justify-between bg-white p-5 rounded-[20px] shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] w-[200px] h-full"
    >
      <div className="flex justify-center items-center text-xl font-semibold h-[14%] w-full rounded-[15px] bg-transparent text-black shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.22),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] transition-all duration-300 ease-in-out overflow-hidden">
        <img src={logo} alt="logo" className="w-full h-full object-cover rounded-[15px] shadow-[0_8px_20px_rgba(0,0,0,0.3),0_4px_10px_rgba(0,0,0,0.2),0_2px_5px_rgba(0,0,0,0.15)]" />
      </div>
      <ul className="mt-4 flex-1 py-4 flex flex-col items-center text-center justify-start gap-4 w-full bg-transparent rounded-[15px] shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.22),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] transition-all duration-300 ease-in-out overflow-y-auto hide-scrollbar smooth-scroll">
          <NavLink content="Dashboard" view="dashboard" activeView={activeView} onClick={setActiveView} />
          <NavLink content="Profile" view="profile" activeView={activeView} onClick={setActiveView} />
          <NavLink content="Appointments" view="appointments" activeView={activeView} onClick={setActiveView} />
          <NavLink content="Patient List" view="patients" activeView={activeView} onClick={setActiveView} />
          <NavLink content="Schedule" view="schedule" activeView={activeView} onClick={setActiveView} />
          <NavLink content="Inbox" view="inbox" activeView={activeView} onClick={setActiveView} />
          {/*<NavLink content="Home" view="home" activeView={activeView} onClick={setActiveView} />
          */}{/*<NavLink content="About" view="about" activeView={activeView} onClick={setActiveView} />
          */}{/*<NavLink content="Contact" view="contact" activeView={activeView} onClick={setActiveView} />
          */}{/*<NavLink content="Services" view="services" activeView={activeView} onClick={setActiveView} />
          */}
      </ul>
    </nav>
  )
}

export default SideNavBar