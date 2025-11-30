import React, { useState, useEffect } from 'react'
import patientDataStore from '../store/patientDataStore'
import '../App.css'

function AppointmentDetailModal({ appointment, onClose, onUpdate, onUpdatePatient }) {
  // Find patient by name (in real app, would use patient ID)
  const patient = patientDataStore.getPatients().find(p => p.name === appointment.patient) || {
    id: 1,
    name: appointment.patient,
    age: 45,
    email: 'john.doe@email.com',
    phone: '+1 234-567-8900'
  }
  
  // Get medical data from store
  const medicalData = patientDataStore.getMedicalData(patient.id)
  
  // Declare all state variables first
  const [isEditingMedical, setIsEditingMedical] = useState(false)
  const [editedMedicalData, setEditedMedicalData] = useState({
    bloodType: medicalData.bloodType,
    allergies: [...medicalData.allergies],
    chronicConditions: [...medicalData.chronicConditions],
    currentMedications: medicalData.currentMedications.map(m => ({ ...m }))
  })
  
  const [patientDetails, setPatientDetails] = useState({
    ...patient,
    ...medicalData,
    address: '123 Main St, New York, NY 10001',
    emergencyContact: medicalData.emergencyContact ? 
      `${medicalData.emergencyContact.name} - ${medicalData.emergencyContact.phone}` : 
      'Jane Doe - +1 234-567-8901'
  })
  
  // Subscribe to store changes
  useEffect(() => {
    const updateFromStore = () => {
      const updatedMedicalData = patientDataStore.getMedicalData(patient.id)
      setPatientDetails(prev => ({
        ...patient,
        ...updatedMedicalData,
        address: prev.address || '123 Main St, New York, NY 10001',
        emergencyContact: updatedMedicalData.emergencyContact ? 
          `${updatedMedicalData.emergencyContact.name} - ${updatedMedicalData.emergencyContact.phone}` : 
          prev.emergencyContact
      }))
      if (!isEditingMedical) {
        setEditedMedicalData({
          bloodType: updatedMedicalData.bloodType,
          allergies: [...updatedMedicalData.allergies],
          chronicConditions: [...updatedMedicalData.chronicConditions],
          currentMedications: updatedMedicalData.currentMedications.map(m => ({ ...m }))
        })
      }
    }
    
    // Initial load
    updateFromStore()
    
    // Subscribe to store changes
    const unsubscribe = patientDataStore.subscribe(updateFromStore)
    return unsubscribe
  }, [patient.id, isEditingMedical])

  const [previousAppointments] = useState([
    { id: 1, date: '2024-01-10', type: 'Check-up', diagnosis: 'Hypertension under control', doctor: 'Dr. Smith' },
    { id: 2, date: '2023-12-15', type: 'Follow-up', diagnosis: 'Diabetes management - adjusting medication', doctor: 'Dr. Smith' },
    { id: 3, date: '2023-11-20', type: 'Consultation', diagnosis: 'Annual physical - all normal', doctor: 'Dr. Johnson' },
  ])

  const [reports] = useState([
    { id: 1, name: 'Blood Test Results', date: '2024-01-10', type: 'Lab Report', status: 'Available' },
    { id: 2, name: 'ECG Report', date: '2024-01-10', type: 'Diagnostic', status: 'Available' },
    { id: 3, name: 'X-Ray Chest', date: '2023-12-15', type: 'Imaging', status: 'Available' },
    { id: 4, name: 'Blood Sugar Monitoring', date: '2023-12-15', type: 'Lab Report', status: 'Available' },
  ])

  const [activeTab, setActiveTab] = useState('info') // 'info', 'history', 'reports'
  const [comments, setComments] = useState(appointment.comments || '')
  const [diagnosis, setDiagnosis] = useState(appointment.diagnosis || '')
  const [prescription, setPrescription] = useState(appointment.prescription || '')
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  const handleCloseAppointment = () => {
    if (!diagnosis.trim()) {
      alert('Please add a diagnosis before closing the appointment')
      return
    }
    setShowCloseConfirm(true)
  }

  const confirmCloseAppointment = () => {
    // TODO: Update in database - await closeAppointment(appointment.id, { diagnosis, prescription, comments, status: 'Completed' })
    const updatedAppointment = {
      ...appointment,
      diagnosis,
      prescription,
      comments,
      status: 'Completed'
    }
    onUpdate(updatedAppointment)
    alert('Appointment closed successfully!')
    onClose()
  }

  const handleSaveProgress = () => {
    // TODO: Update in database without closing - await updateAppointment(appointment.id, { diagnosis, prescription, comments })
    const updatedAppointment = {
      ...appointment,
      diagnosis,
      prescription,
      comments
    }
    onUpdate(updatedAppointment)
    alert('Progress saved successfully!')
  }

  const handleSaveMedical = () => {
    const updatedMedicalData = {
      bloodType: editedMedicalData.bloodType,
      allergies: editedMedicalData.allergies,
      chronicConditions: editedMedicalData.chronicConditions,
      currentMedications: editedMedicalData.currentMedications
    }
    
    // Update in store (single source of truth)
    patientDataStore.updateMedicalData(patient.id, updatedMedicalData)
    
    // Update local state
    const updatedPatientDetails = {
      ...patientDetails,
      ...updatedMedicalData
    }
    setPatientDetails(updatedPatientDetails)
    
    // TODO: Update in database - await updatePatientMedicalInfo(patient.id, updatedMedicalData)
    if (onUpdatePatient) {
      onUpdatePatient(updatedPatientDetails)
    }
    setIsEditingMedical(false)
    alert('Medical information updated successfully!')
  }

  const handleAddMedication = () => {
    setEditedMedicalData({
      ...editedMedicalData,
      currentMedications: [...editedMedicalData.currentMedications, { name: '', dosage: '', frequency: '' }]
    })
  }

  const handleRemoveMedication = (index) => {
    setEditedMedicalData({
      ...editedMedicalData,
      currentMedications: editedMedicalData.currentMedications.filter((_, i) => i !== index)
    })
  }

  const handleUpdateMedication = (index, field, value) => {
    const updated = [...editedMedicalData.currentMedications]
    updated[index] = { ...updated[index], [field]: value }
    setEditedMedicalData({ ...editedMedicalData, currentMedications: updated })
  }

  const handleAddAllergy = () => {
    const newAllergy = prompt('Enter allergy name:')
    if (newAllergy && newAllergy.trim()) {
      setEditedMedicalData({
        ...editedMedicalData,
        allergies: [...editedMedicalData.allergies, newAllergy.trim()]
      })
    }
  }

  const handleRemoveAllergy = (index) => {
    setEditedMedicalData({
      ...editedMedicalData,
      allergies: editedMedicalData.allergies.filter((_, i) => i !== index)
    })
  }

  const handleAddCondition = () => {
    const newCondition = prompt('Enter chronic condition:')
    if (newCondition && newCondition.trim()) {
      setEditedMedicalData({
        ...editedMedicalData,
        chronicConditions: [...editedMedicalData.chronicConditions, newCondition.trim()]
      })
    }
  }

  const handleRemoveCondition = (index) => {
    setEditedMedicalData({
      ...editedMedicalData,
      chronicConditions: editedMedicalData.chronicConditions.filter((_, i) => i !== index)
    })
  }

  const handleDownloadReport = (report) => {
    // TODO: Implement download from database - await downloadReport(report.id)
    alert(`Downloading ${report.name}...`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Appointment Details</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {appointment.date}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {appointment.time}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <div>
                  <span className="text-xs text-gray-500 mr-2">Type:</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                    {appointment.type}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 mr-2">Method:</span>
                  {appointment.method === 'Video' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Video Call
                    </span>
                  )}
                  {appointment.method === 'Call' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Phone Call
                    </span>
                  )}
                  {appointment.method === 'Chat' && (
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat/Message
                    </span>
                  )}
                  {appointment.method === 'In-Person' && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      In-Person
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 flex-shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Patient Info
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Notes & Diagnosis
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
          {/* Patient Info Tab */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {patientDetails.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{patientDetails.name}</h3>
                    <p className="text-gray-600">{patientDetails.age} years old • {patientDetails.gender}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800">Contact Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-800">{patientDetails.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Phone</label>
                    <p className="text-sm text-gray-800">{patientDetails.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Address</label>
                    <p className="text-sm text-gray-800">{patientDetails.address}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Emergency Contact</label>
                    <p className="text-sm text-gray-800">{patientDetails.emergencyContact}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-gray-800">Medical Information</h4>
                  {!isEditingMedical ? (
                    <button
                      onClick={() => setIsEditingMedical(true)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditingMedical(false)
                          setEditedMedicalData({
                            bloodType: patientDetails.bloodType,
                            allergies: [...patientDetails.allergies],
                            chronicConditions: [...patientDetails.chronicConditions],
                            currentMedications: patientDetails.currentMedications.map(m => ({ ...m }))
                          })
                        }}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveMedical}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Blood Type</label>
                    {isEditingMedical ? (
                      <select
                        value={editedMedicalData.bloodType}
                        onChange={(e) => setEditedMedicalData({...editedMedicalData, bloodType: e.target.value})}
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <p className="text-sm text-gray-800">{patientDetails.bloodType}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-gray-600">Allergies</label>
                      {isEditingMedical && (
                        <button
                          onClick={handleAddAllergy}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(isEditingMedical ? editedMedicalData.allergies : patientDetails.allergies).map((allergy, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
                          {allergy}
                          {isEditingMedical && (
                            <button
                              onClick={() => handleRemoveAllergy(index)}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-gray-600">Chronic Conditions</label>
                      {isEditingMedical && (
                        <button
                          onClick={handleAddCondition}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(isEditingMedical ? editedMedicalData.chronicConditions : patientDetails.chronicConditions).map((condition, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium flex items-center gap-1">
                          {condition}
                          {isEditingMedical && (
                            <button
                              onClick={() => handleRemoveCondition(index)}
                              className="text-orange-600 hover:text-orange-800 font-bold"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-gray-600">Current Medications</label>
                      {isEditingMedical && (
                        <button
                          onClick={handleAddMedication}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                    {isEditingMedical ? (
                      <div className="mt-1 space-y-2">
                        {editedMedicalData.currentMedications.map((med, index) => (
                          <div key={index} className="p-2 bg-blue-50 rounded border border-blue-200 space-y-1">
                            <input
                              type="text"
                              value={med.name}
                              onChange={(e) => handleUpdateMedication(index, 'name', e.target.value)}
                              placeholder="Medication name"
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={med.dosage}
                              onChange={(e) => handleUpdateMedication(index, 'dosage', e.target.value)}
                              placeholder="Dosage"
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={med.frequency}
                              onChange={(e) => handleUpdateMedication(index, 'frequency', e.target.value)}
                              placeholder="Frequency"
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => handleRemoveMedication(index)}
                              className="w-full px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="mt-1 space-y-1">
                        {patientDetails.currentMedications.map((med, index) => (
                          <li key={index} className="text-sm text-gray-800 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                            {typeof med === 'string' ? med : `${med.name} (${med.dosage}, ${med.frequency})`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Previous Appointments</h4>
              <div className="space-y-3">
                {previousAppointments.map((apt) => (
                  <div key={apt.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-semibold text-gray-800">{apt.type}</h5>
                        <p className="text-sm text-gray-600">{apt.date} • {apt.doctor}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="text-xs font-medium text-gray-600">Diagnosis:</label>
                      <p className="text-sm text-gray-800 mt-1">{apt.diagnosis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Medical Reports & Documents</h4>
              <div className="grid grid-cols-1 gap-3">
                {reports.map((report) => (
                  <div key={report.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-800">{report.name}</h5>
                        <p className="text-sm text-gray-600">{report.type} • {report.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {report.status}
                      </span>
                      <button
                        onClick={() => handleDownloadReport(report)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Diagnosis Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Diagnosis *</label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={4}
                  placeholder="Enter diagnosis..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Prescription</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  rows={4}
                  placeholder="Enter prescription details..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Comments & Notes</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  placeholder="Add any additional comments or notes..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Make sure to save your progress regularly. You must add a diagnosis before closing the appointment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSaveProgress}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Save Progress
            </button>
            <button
              onClick={handleCloseAppointment}
              disabled={appointment.status === 'Completed' || appointment.status === 'Cancelled'}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Complete & Close Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Close Confirmation Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Complete Appointment?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to complete and close this appointment? This action will mark the appointment as completed.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                Please ensure all diagnosis, prescriptions, and notes are saved before completing.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCloseConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCloseAppointment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Yes, Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentDetailModal

