import React, { useState, useEffect } from 'react'
import AppointmentDetailModal from './AppointmentDetailModal'
import '../App.css'

function AppointmentsView() {
  // TODO: Replace with database fetch - useEffect(() => { fetchAppointments() }, [])
  const [appointments, setAppointments] = useState([
    { id: 1, date: '2024-01-15', time: '10:00 AM', patient: 'John Doe', type: 'Consultation', method: 'Video', status: 'Confirmed' },
    { id: 2, date: '2024-01-15', time: '2:30 PM', patient: 'Jane Smith', type: 'Follow-up', method: 'Call', status: 'Pending' },
    { id: 3, date: '2024-01-16', time: '9:00 AM', patient: 'Mike Johnson', type: 'Consultation', method: 'Video', status: 'Confirmed' },
    { id: 4, date: '2024-01-16', time: '11:30 AM', patient: 'Sarah Williams', type: 'Check-up', method: 'In-Person', status: 'Cancelled' },
    { id: 5, date: '2024-01-17', time: '8:45 AM', patient: 'Emily Carter', type: 'Consultation', method: 'Chat', status: 'Confirmed' },
    { id: 6, date: '2024-01-17', time: '1:15 PM', patient: 'Daniel Reed', type: 'Follow-up', method: 'Video', status: 'Pending' },
    { id: 7, date: '2024-01-18', time: '11:00 AM', patient: 'Laura Chen', type: 'Therapy', method: 'In-Person', status: 'Confirmed' },
    { id: 8, date: '2024-01-18', time: '3:45 PM', patient: 'Omar Ali', type: 'Consultation', method: 'Call', status: 'Confirmed' },
    { id: 9, date: '2024-01-19', time: '9:30 AM', patient: 'Priya Patel', type: 'Check-up', method: 'Video', status: 'Pending' },
    { id: 10, date: '2024-01-19', time: '4:00 PM', patient: 'David Lee', type: 'Therapy', method: 'In-Person', status: 'Cancelled' },
    { id: 11, date: '2024-01-20', time: '10:15 AM', patient: 'Sofia Romero', type: 'Consultation', method: 'Chat', status: 'Confirmed' },
    { id: 12, date: '2024-01-20', time: '12:45 PM', patient: 'Ethan Walker', type: 'Follow-up', method: 'Video', status: 'Pending' },
    { id: 13, date: '2024-01-21', time: '2:00 PM', patient: 'Hannah Kim', type: 'Consultation', method: 'Call', status: 'Confirmed' },
    { id: 14, date: '2024-01-21', time: '5:30 PM', patient: 'Marcus Brown', type: 'Therapy', method: 'In-Person', status: 'Confirmed' },
    { id: 15, date: '2024-01-22', time: '11:45 AM', patient: 'Nina Alvarez', type: 'Check-up', method: 'Video', status: 'Pending' },
  ])

  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    patient: '',
    type: 'Consultation',
    method: 'Video',
    status: 'Pending'
  })

  // Filter states
  const [filters, setFilters] = useState({
    status: 'All',
    type: 'All',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  })

  // Apply filters to appointments
  const filteredAppointments = appointments.filter(appointment => {
    // Status filter
    if (filters.status !== 'All' && appointment.status !== filters.status) {
      return false
    }
    
    // Type filter
    if (filters.type !== 'All' && appointment.type !== filters.type) {
      return false
    }
    
    // Date range filter
    if (filters.dateFrom && appointment.date < filters.dateFrom) {
      return false
    }
    if (filters.dateTo && appointment.date > filters.dateTo) {
      return false
    }
    
    // Search filter
    if (filters.searchTerm && !appointment.patient.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false
    }
    
    return true
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      status: 'All',
      type: 'All',
      dateFrom: '',
      dateTo: '',
      searchTerm: ''
    })
  }

  const handleTodayFilter = () => {
    const today = new Date().toISOString().split('T')[0]
    setFilters({
      status: 'All',
      type: 'All',
      dateFrom: today,
      dateTo: today,
      searchTerm: ''
    })
  }

  // Calculate statistics
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  }


  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleNewAppointment = () => {
    setEditingAppointment(null)
    setFormData({
      date: '',
      time: '',
      patient: '',
      type: 'Consultation',
      method: 'Video',
      status: 'Pending'
    })
    setShowModal(true)
  }

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment)
    setFormData({
      date: appointment.date,
      time: appointment.time,
      patient: appointment.patient,
      type: appointment.type,
      method: appointment.method || 'Video',
      status: appointment.status
    })
    setShowModal(true)
  }

  const handleCancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      // TODO: Update in database - await updateAppointment(id, { status: 'Cancelled' })
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? { ...apt, status: 'Cancelled' } : apt)
      )
    }
  }

  const handleSaveAppointment = () => {
    if (!formData.date || !formData.time || !formData.patient) {
      alert('Please fill in all required fields')
      return
    }

    if (editingAppointment) {
      // TODO: Update in database - await updateAppointment(editingAppointment.id, formData)
      setAppointments(prev =>
        prev.map(apt => apt.id === editingAppointment.id ? { ...apt, ...formData } : apt)
      )
    } else {
      // TODO: Create in database - await createAppointment(formData)
      const newAppointment = {
        id: Math.max(...appointments.map(a => a.id)) + 1,
        ...formData
      }
      setAppointments(prev => [...prev, newAppointment])
    }
    setShowModal(false)
  }

  const handleOpenDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailModal(true)
  }

  const handleUpdateAppointment = (updatedAppointment) => {
    // TODO: Update in database - await updateAppointment(updatedAppointment.id, updatedAppointment)
    setAppointments(prev =>
      prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
    )
  }


  return (
    <div className="w-full h-full p-8 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Appointments</h1>
          <p className="text-lg text-white/90 drop-shadow-md">View and manage your appointments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <button
            onClick={handleTodayFilter}
            className="bg-gradient-to-br from-teal-500 to-teal-600 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all text-white"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-sm font-semibold">Today</div>
          </button>

          <button
            onClick={() => handleFilterChange('status', 'All')}
            className={`bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all ${
              filters.status === 'All' ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total</div>
          </button>
          
          <button
            onClick={() => handleFilterChange('status', 'Pending')}
            className={`bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all ${
              filters.status === 'Pending' ? 'ring-2 ring-yellow-500' : ''
            }`}
          >
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600 mt-1">Pending</div>
          </button>
          
          <button
            onClick={() => handleFilterChange('status', 'Confirmed')}
            className={`bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all ${
              filters.status === 'Confirmed' ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600 mt-1">Confirmed</div>
          </button>
          
          <button
            onClick={() => handleFilterChange('status', 'Completed')}
            className={`bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all ${
              filters.status === 'Completed' ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </button>
          
          <button
            onClick={() => handleFilterChange('status', 'Cancelled')}
            className={`bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all ${
              filters.status === 'Cancelled' ? 'ring-2 ring-red-500' : ''
            }`}
          >
            <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600 mt-1">Cancelled</div>
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-[25px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredAppointments.length} of {appointments.length} appointments
              </p>
            </div>
            <button 
              onClick={handleNewAppointment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + New Appointment
            </button>
          </div>

          {/* Active Filters Display */}
          {(filters.status !== 'All' || filters.type !== 'All' || filters.dateFrom || filters.dateTo || filters.searchTerm) && (
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-600">Active Filters:</span>
              {filters.status !== 'All' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                  Status: {filters.status}
                  <button onClick={() => handleFilterChange('status', 'All')} className="hover:text-blue-900">×</button>
                </span>
              )}
              {filters.type !== 'All' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1">
                  Type: {filters.type}
                  <button onClick={() => handleFilterChange('type', 'All')} className="hover:text-purple-900">×</button>
                </span>
              )}
              {filters.dateFrom && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                  From: {filters.dateFrom}
                  <button onClick={() => handleFilterChange('dateFrom', '')} className="hover:text-green-900">×</button>
                </span>
              )}
              {filters.dateTo && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                  To: {filters.dateTo}
                  <button onClick={() => handleFilterChange('dateTo', '')} className="hover:text-green-900">×</button>
                </span>
              )}
              {filters.searchTerm && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium flex items-center gap-1">
                  Search: "{filters.searchTerm}"
                  <button onClick={() => handleFilterChange('searchTerm', '')} className="hover:text-teal-900">×</button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Filters Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">Advanced Filters</h3>
              <button
                onClick={handleClearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Search Patient</label>
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  placeholder="Patient name..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Appointment Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Therapy">Therapy</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
            <table className="w-full">
              <thead className="sticky top-0 z-20">
                <tr className="border-b-2 border-gray-200 bg-white">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Patient</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-sm">No appointments found matching your filters</p>
                        <button
                          onClick={handleClearFilters}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-gray-700">{appointment.date}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{appointment.time}</td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-medium">{appointment.patient}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                          {appointment.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {appointment.method === 'Video' && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Video
                          </span>
                        )}
                        {appointment.method === 'Call' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call
                          </span>
                        )}
                        {appointment.method === 'Chat' && (
                          <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat
                          </span>
                        )}
                        {appointment.method === 'In-Person' && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            In-Person
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleOpenDetails(appointment)}
                          className="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 font-medium transition-colors"
                        >
                          Open
                        </button>
                        <button 
                          onClick={() => handleEditAppointment(appointment)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={appointment.status === 'Cancelled' || appointment.status === 'Completed'}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>

      {/* Modal for New/Edit Appointment */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={formData.patient}
                  onChange={(e) => setFormData({...formData, patient: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Therapy">Therapy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Communication Method</label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({...formData, method: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Video">Video Call</option>
                  <option value="Call">Phone Call</option>
                  <option value="Chat">Chat/Message</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAppointment}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setShowDetailModal(false)}
          onUpdate={handleUpdateAppointment}
        />
      )}
    </div>
  )
}

export default AppointmentsView

