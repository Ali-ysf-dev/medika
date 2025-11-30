import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import '../App.css'

// SVG Icons - declared outside component to avoid render issues
const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 8L6 5.5V10.5L10 8Z" fill="currentColor"/>
    <rect x="2" y="3" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
)

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3H13C13.5523 3 14 3.44772 14 4V10C14 10.5523 13.5523 11 13 11H6L3 14V4C3 3.44772 3.44772 3 4 3H3Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 2H5C4.44772 2 4 2.44772 4 3V13C4 13.5523 4.44772 14 5 14H11C11.5523 14 12 13.5523 12 13V3C12 2.44772 11.5523 2 11 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="8" y1="12" x2="8" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ArrowUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4.5L6 7.5L3 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function GridView({ 
  // TODO: Replace all props with database fetch - useEffect(() => { fetchDashboardData() }, [])
  // Props for data (will come from database later)
  userName = 'Mike Parker',
  greeting = 'Good morning',
  reviewScore = 4.6,
  patientsConsulted = 146,
  patientsGrowth = 3,
  appointments = [
    { date: '10.11.2019 10:00', patient: 'Dave Johnson', type: 'Video' },
    { date: '17.11.2019 18:30', patient: 'Abby Stivenson', type: 'Video' },
    { date: '19.11.2019 15:45', patient: 'Jerry Spenser', type: 'Chat' },
    { date: '22.11.2019 12:30', patient: 'Mark Gylenhaal', type: 'Phone' },
  ],
  disableAnimation = false,
  navigateToAppointments = null,
  navigateToPatients = null,
  navigateToInbox = null
}) {
  const gridRef = useRef(null)

  useLayoutEffect(() => {
    if (gridRef.current && !disableAnimation) {
      // Set initial state immediately - runs before paint
      gsap.set(gridRef.current, { opacity: 0, scale: 0.95 })
      
      // Animate in with slight delay for smoother transition
      gsap.to(gridRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.15
      })
    } else if (gridRef.current && disableAnimation) {
      // If animation is disabled, set to visible immediately
      gsap.set(gridRef.current, { opacity: 1, scale: 1 })
    }
  }, [disableAnimation])

  // Get icon based on appointment type
  const getAppointmentIcon = (type) => {
    switch(type) {
      case 'Video': return <VideoIcon />
      case 'Chat': return <ChatIcon />
      case 'Phone': return <PhoneIcon />
      case 'In-Person': return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M2 14C2 11.2386 4.23858 9 7 9H9C11.7614 9 14 11.2386 14 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      )
      default: return <VideoIcon />
    }
  }

  // Get today's schedule appointments
  const getTodaysSchedule = () => {
    const today = new Date().toISOString().split('T')[0]
    // Sample today's schedule - in real app, fetch from appointments
    return [
      { time: '09:00 AM', patient: 'John Doe', type: 'Video', status: 'Confirmed' },
      { time: '11:30 AM', patient: 'Jane Smith', type: 'In-Person', status: 'Confirmed' },
      { time: '02:00 PM', patient: 'Mike Johnson', type: 'Phone', status: 'Pending' },
      { time: '04:30 PM', patient: 'Sarah Williams', type: 'Video', status: 'Confirmed' },
    ]
  }

  const todaysSchedule = getTodaysSchedule()

  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <line x1="5" y1="1" x2="5" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="11" y1="1" x2="11" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="2" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )


  return (
    <div ref={gridRef} style={disableAnimation ? {} : { opacity: 0, transform: 'scale(0.95)' }} className="h-full w-full p-6 bg-transparent flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
      <div className="grid grid-cols-3 grid-rows-2 gap-6 h-full auto-rows-fr">
        {/* Top Left - Greeting and Stats */}
        <div className="col-span-1 row-span-1 flex flex-col gap-4 overflow-hidden">
          {/* Greeting Card */}
          <div className="bg-white rounded-[15px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] flex flex-col justify-center">
            <p className="text-sm text-gray-600 mb-1 text-center">{greeting}</p>
            <h2 className="text-2xl font-bold text-gray-800 text-center">{userName}</h2>
          </div>

          {/* Review Score Card */}
          <div className="bg-white rounded-[15px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-orange-500 mb-2">{reviewScore}*</div>
            <p className="text-sm text-gray-600 text-center">Review score</p>
            <p className="text-xs text-gray-500 text-center">(Overall)</p>
          </div>
        </div>

        {/* Top Right - Upcoming Appointments */}
        <div className="col-span-2 row-span-1 bg-white rounded-[15px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Upcoming appointments</h3>
            <button 
              onClick={() => navigateToAppointments && navigateToAppointments()}
              className="text-blue-500 text-sm hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              View all
              <ArrowRightIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-20">
                <tr className="border-b border-gray-200 bg-white">
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 bg-white">Date</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 bg-white">Patient</th>
                  <th className="text-left text-sm font-semibold text-gray-600 pb-3 bg-white">Type of appointment</th>
                  <th className="text-right text-sm font-semibold text-gray-600 pb-3 bg-white"></th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr 
                    key={index} 
                    onClick={() => navigateToAppointments && navigateToAppointments()}
                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 text-sm text-gray-700">{appointment.date}</td>
                    <td className="py-3 text-sm text-gray-700">{appointment.patient}</td>
                    <td className="py-3 text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-gray-500">{getAppointmentIcon(appointment.type)}</span>
                      {appointment.type}
                    </td>
                    <td className="py-3 text-right">
                      <ArrowRightIcon />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Left - Today's Schedule */}
        <div className="col-span-1 row-span-1 bg-white rounded-[15px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <h3 className="text-lg font-bold text-gray-800">Today's Schedule</h3>
            </div>
            <button 
              onClick={() => navigateToAppointments && navigateToAppointments()}
              className="text-blue-500 text-xs hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              View all
              <ArrowRightIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <div className="space-y-3">
              {todaysSchedule.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => navigateToAppointments && navigateToAppointments()}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{item.time}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <span className="text-gray-500">{getAppointmentIcon(item.type)}</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{item.patient}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Middle - Patients and Inbox Stacked */}
        <div className="col-span-1 row-span-1 flex flex-col gap-4 overflow-hidden">
          {/* Patients Consulted Card */}
          <div className="flex-1 bg-white rounded-[15px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-800">Patients</h3>
              <button 
                onClick={() => navigateToPatients && navigateToPatients()}
                className="text-blue-500 text-xs hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                View all
                <ArrowRightIcon />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-4xl font-bold text-teal-600">{patientsConsulted}</div>
                <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                  +{patientsGrowth}%
                  <ArrowUpIcon />
                </span>
              </div>
              <p className="text-xs text-gray-600 text-center">Patients</p>
              <p className="text-[10px] text-gray-500 text-center">(Consulted)</p>
            </div>
          </div>

          {/* Inbox Card */}
          <div className="flex-1 bg-white rounded-[15px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-800">Inbox</h3>
              <button 
                onClick={() => navigateToInbox && navigateToInbox()}
                className="text-blue-500 text-xs hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                View all
                <ArrowRightIcon />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
              <p className="text-xs text-gray-600 text-center">New Messages</p>
              <p className="text-[10px] text-gray-500 text-center">Unread</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default GridView
