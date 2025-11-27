import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { gsap } from 'gsap'
import surgeonImage from '../assets/surgeon.jpg'
import '../App.css'
import LoginForm from './LoginForm'
import GridView from './GridView'
import HomeView from './HomeView'
import AboutView from './AboutView'
import ContactView from './ContactView'
import ServicesView from './ServicesView'
import AppointmentsView from './AppointmentsView'
import PatientListView from './PatientListView'
import ScheduleView from './ScheduleView'
import InboxView from './InboxView'
import ProfileView from './ProfileView'

function MainContainer({ isLoggedIn, setIsLoggedIn, activeView, setActiveView }) {
  const [showBackground] = useState(true)
  const containerRef = useRef(null)
  const viewsStackRef = useRef([])
  const viewRefs = useRef({})
  const previousViewRef = useRef(null)

  // Map view names to components
  const viewComponents = {
    dashboard: GridView,
    appointments: AppointmentsView,
    patients: PatientListView,
    schedule: ScheduleView,
    inbox: InboxView,
    profile: ProfileView,
    home: HomeView,
    about: AboutView,
    contact: ContactView,
    services: ServicesView
  }

  // Initial animation when logged in
  useLayoutEffect(() => {
    if (isLoggedIn && containerRef.current) {
      // Set initial position immediately (off-screen to the right) - runs before paint
      gsap.set(containerRef.current, {
        x: 500,
        opacity: 0,
        scale: 0.95
      })
      
      // Animate in from right to left
      gsap.to(containerRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.7
      })
    }
  }, [isLoggedIn])

  // Stack-based animation when view changes
  useEffect(() => {
    if (!isLoggedIn || !activeView) return

    const currentViewRef = viewRefs.current[activeView]
    const previousView = previousViewRef.current

    // If this is the first view or same view, just show it immediately
    if (!previousView || previousView === activeView) {
      if (currentViewRef) {
        // Set immediately without animation for first view
        gsap.set(currentViewRef, {
          x: 0,
          opacity: 1,
          scale: 1,
          zIndex: 1,
          immediateRender: true
        })
      }
      if (!previousView) {
        previousViewRef.current = activeView
      }
      return
    }

    const previousViewElement = viewRefs.current[previousView]

    // Animate previous view out (slide right and fade) - faster and smoother
    if (previousViewElement) {
      gsap.to(previousViewElement, {
        x: 500,
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          // Move to back of stack
          gsap.set(previousViewElement, {
            zIndex: 0,
            x: 0,
            scale: 1
          })
        }
      })
    }

    // Animate new view in (from right) - optimized timing
    if (currentViewRef) {
      // Add to stack if not already there
      if (!viewsStackRef.current.includes(activeView)) {
        viewsStackRef.current.push(activeView)
      }

      // Set initial position (off-screen to the right) immediately
      gsap.set(currentViewRef, {
        x: 500,
        opacity: 0,
        scale: 0.95,
        zIndex: viewsStackRef.current.length,
        immediateRender: true
      })

      // Animate in with optimized timing - use requestAnimationFrame for smooth start
      requestAnimationFrame(() => {
        gsap.to(currentViewRef, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        })
      })
    }

    previousViewRef.current = activeView
  }, [activeView, isLoggedIn])

  const renderView = (viewName) => {
    const ViewComponent = viewComponents[viewName]
    if (!ViewComponent) return null

    // Pass props to specific views
    const isGridView = viewName === 'dashboard'
    const viewProps = isGridView 
      ? { 
          disableAnimation: true, 
          navigateToAppointments: () => setActiveView('appointments'),
          navigateToPatients: () => setActiveView('patients'),
          navigateToInbox: () => setActiveView('inbox')
        }
      : {}

    return (
      <div
        key={viewName}
        ref={(el) => {
          if (el) viewRefs.current[viewName] = el
        }}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: viewName === activeView ? 1 : 0,
          zIndex: viewName === activeView ? 1 : 0
        }}
      >
        <ViewComponent {...viewProps} />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      style={isLoggedIn ? { opacity: 0, transform: 'translateX(500px) scale(0.95)' } : {}}
      className='flex-1 h-full rounded-[20px] ml-4 shadow-[0_10px_30px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.15),inset_0_8px_16px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden relative'
    >
      
      {/* live effects for the background starts here */}
      {showBackground ? <div className='absolute inset-0 w-full h-full'>
        <div 
          className='absolute inset-0 w-full h-full live-background heartbeat-effect'
          style={{
            backgroundImage: `url(${surgeonImage})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className='absolute inset-0 w-full h-full bg-gradient-to-br from-black/20 via-transparent to-black/30'></div>
        <div className='absolute inset-0 w-full h-full bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
        <div className='absolute inset-0 w-full h-full live-overlay'></div>
      </div> : <div className='absolute inset-0 w-full h-full bg-white'></div>}
      {/* live effects for the background ends here */}
      
      {/* inner of the maincontainer starts here */}
      <div className='relative z-10 h-full'>
        {isLoggedIn ? (
          <div className="relative w-full h-full">
            {Object.keys(viewComponents).map(viewName => renderView(viewName))}
          </div>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          </div>
        )}
      </div>
      {/* inner of the maincontainer ends here */}
    </div>
  )
}

export default MainContainer