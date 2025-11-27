import React, { useState, useEffect } from 'react'
import '../App.css'

function ScheduleView() {
  // TODO: Replace with database fetch - useEffect(() => { fetchSchedule() }, [])
  const [schedule, setSchedule] = useState({
    monday: { available: true, start: '09:00', end: '17:00' },
    tuesday: { available: true, start: '09:00', end: '17:00' },
    wednesday: { available: true, start: '09:00', end: '17:00' },
    thursday: { available: true, start: '09:00', end: '17:00' },
    friday: { available: true, start: '09:00', end: '17:00' },
    saturday: { available: false, start: '09:00', end: '17:00' },
    sunday: { available: false, start: '09:00', end: '17:00' },
  })

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const handleToggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available }
    }))
  }

  const handleTimeChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  const handleSave = async () => {
    // TODO: Replace with database save - await saveSchedule(schedule)
    try {
      // await fetch('/api/schedule', { method: 'POST', body: JSON.stringify(schedule) })
      alert('Schedule updated successfully!')
    } catch (error) {
      alert('Error saving schedule')
    }
  }


  return (
    <div className="w-full h-full p-6 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">Schedule</h1>
          <p className="text-sm text-white/90 drop-shadow-md">Manage your availability</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-[20px] p-5 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)]">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">Weekly Availability</h2>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {days.map((day, index) => (
              <div 
                key={day} 
                className={`p-3 rounded-lg border transition-all text-center ${
                  schedule[day].available 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="checkbox"
                    checked={schedule[day].available}
                    onChange={() => handleToggleDay(day)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="text-sm font-semibold text-gray-800 cursor-pointer">
                    {dayLabels[index]}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            {days.filter(day => schedule[day].available).map((day) => (
              <div 
                key={day} 
                className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-200"
              >
                <span className="text-sm font-medium text-gray-700 capitalize w-20">
                  {day.substring(0, 3)}
                </span>
                <input
                  type="time"
                  value={schedule[day].start}
                  onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={schedule[day].end}
                  onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <button 
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ScheduleView

