import React, { useState, useEffect } from 'react'
import patientDataStore from '../store/patientDataStore'
import '../App.css'

function PatientProfileModal({ patient, onClose, onUpdate }) {
  // Get medical data from store
  const medicalData = patientDataStore.getMedicalData(patient.id)
  
  const [patientDetails, setPatientDetails] = useState({
    ...patient,
    ...medicalData
  })
  
  // Subscribe to store changes
  useEffect(() => {
    const updateFromStore = () => {
      const updatedMedicalData = patientDataStore.getMedicalData(patient.id)
      setPatientDetails(prev => ({
        ...patient,
        ...updatedMedicalData,
        emergencyContact: prev.emergencyContact || updatedMedicalData.emergencyContact,
        insurance: prev.insurance || updatedMedicalData.insurance
      }))
      setVitalSigns([...updatedMedicalData.vitalSigns])
    }
    
    // Initial load
    updateFromStore()
    
    // Subscribe to store changes
    const unsubscribe = patientDataStore.subscribe(updateFromStore)
    return unsubscribe
  }, [patient.id])

  const [appointmentHistory] = useState([
    { 
      id: 1, 
      date: '2024-01-10', 
      time: '10:00 AM',
      type: 'Check-up', 
      method: 'In-Person',
      diagnosis: 'Hypertension under control. Blood pressure 130/85. Continue current medication.', 
      doctor: 'Dr. Smith',
      prescription: 'Continue Lisinopril 10mg daily',
      status: 'Completed'
    },
    { 
      id: 2, 
      date: '2023-12-15', 
      time: '2:30 PM',
      type: 'Follow-up', 
      method: 'Video',
      diagnosis: 'Diabetes management - HbA1c at 6.8%. Adjusting medication dosage.', 
      doctor: 'Dr. Smith',
      prescription: 'Increase Metformin to 500mg twice daily',
      status: 'Completed'
    },
    { 
      id: 3, 
      date: '2023-11-20', 
      time: '11:00 AM',
      type: 'Consultation', 
      method: 'In-Person',
      diagnosis: 'Annual physical examination - All vitals normal. Recommended lifestyle changes for weight management.', 
      doctor: 'Dr. Johnson',
      prescription: 'None',
      status: 'Completed'
    },
    { 
      id: 4, 
      date: '2023-10-05', 
      time: '9:30 AM',
      type: 'Follow-up', 
      method: 'Call',
      diagnosis: 'Follow-up on blood test results. Cholesterol levels slightly elevated.', 
      doctor: 'Dr. Smith',
      prescription: 'Added Atorvastatin 10mg daily',
      status: 'Completed'
    },
  ])

  const [medicalReports] = useState([
    { 
      id: 1, 
      name: 'Complete Blood Count (CBC)', 
      date: '2024-01-10', 
      type: 'Lab Report', 
      status: 'Available',
      results: 'All values within normal range',
      orderedBy: 'Dr. Smith'
    },
    { 
      id: 2, 
      name: 'HbA1c Test', 
      date: '2024-01-10', 
      type: 'Lab Report', 
      status: 'Available',
      results: 'HbA1c: 6.8% (Good control)',
      orderedBy: 'Dr. Smith'
    },
    { 
      id: 3, 
      name: 'ECG Report', 
      date: '2024-01-10', 
      type: 'Diagnostic', 
      status: 'Available',
      results: 'Normal sinus rhythm',
      orderedBy: 'Dr. Smith'
    },
    { 
      id: 4, 
      name: 'Chest X-Ray', 
      date: '2023-12-15', 
      type: 'Imaging', 
      status: 'Available',
      results: 'No abnormalities detected',
      orderedBy: 'Dr. Johnson'
    },
    { 
      id: 5, 
      name: 'Lipid Panel', 
      date: '2023-10-05', 
      type: 'Lab Report', 
      status: 'Available',
      results: 'Total Cholesterol: 210 mg/dL (Slightly elevated)',
      orderedBy: 'Dr. Smith'
    },
    { 
      id: 6, 
      name: 'Blood Pressure Monitoring', 
      date: '2023-12-15', 
      type: 'Vital Signs', 
      status: 'Available',
      results: '130/85 mmHg (Pre-hypertension)',
      orderedBy: 'Dr. Smith'
    },
  ])

  const [vitalSigns, setVitalSigns] = useState([...medicalData.vitalSigns])

  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingMedical, setIsEditingMedical] = useState(false)
  const [editedData, setEditedData] = useState(patientDetails)
  const [editedMedicalData, setEditedMedicalData] = useState({
    bloodType: medicalData.bloodType,
    height: medicalData.height,
    weight: medicalData.weight,
    allergies: [...medicalData.allergies],
    chronicConditions: [...medicalData.chronicConditions],
    currentMedications: medicalData.currentMedications.map(m => ({ ...m }))
  })
  const [editedVitalSigns, setEditedVitalSigns] = useState([...medicalData.vitalSigns])

  const handleSave = () => {
    // TODO: Update in database - await updatePatient(patient.id, editedData)
    const updatedPatient = { ...patient, ...editedData }
    onUpdate(updatedPatient)
    setIsEditing(false)
    alert('Patient information updated successfully!')
  }

  const handleSaveMedical = () => {
    const updatedMedicalData = {
      bloodType: editedMedicalData.bloodType,
      height: editedMedicalData.height,
      weight: editedMedicalData.weight,
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
    setEditedData(updatedPatientDetails)
    
    // TODO: Update in database - await updatePatientMedicalInfo(patient.id, updatedMedicalData)
    onUpdate({ ...patient, ...updatedPatientDetails })
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

  const handleAddVitalSign = () => {
    const today = new Date().toISOString().split('T')[0]
    setEditedVitalSigns([{ date: today, bp: '', hr: '', temp: '', weight: '' }, ...editedVitalSigns])
  }

  const handleUpdateVitalSign = (index, field, value) => {
    const updated = [...editedVitalSigns]
    updated[index] = { ...updated[index], [field]: value }
    setEditedVitalSigns(updated)
  }

  const handleRemoveVitalSign = (index) => {
    setEditedVitalSigns(editedVitalSigns.filter((_, i) => i !== index))
  }

  const handleSaveVitalSigns = () => {
    // Update in store (single source of truth)
    patientDataStore.updateMedicalData(patient.id, { vitalSigns: editedVitalSigns })
    
    // Update local state
    setVitalSigns([...editedVitalSigns])
    setPatientDetails({
      ...patientDetails,
      vitalSigns: editedVitalSigns
    })
    
    // TODO: Update in database - await updatePatientVitalSigns(patient.id, editedVitalSigns)
    alert('Vital signs updated successfully!')
  }

  const handleDownloadReport = (report) => {
    // TODO: Download from database - await downloadReport(report.id)
    alert(`Downloading ${report.name}...`)
  }

  const getMethodIcon = (method) => {
    switch(method) {
      case 'Video':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      case 'Call':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        )
      case 'In-Person':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {patientDetails.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{patientDetails.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>{patientDetails.age} years old</span>
                  <span>•</span>
                  <span>{patientDetails.gender}</span>
                  <span>•</span>
                  <span>Patient ID: #{patientDetails.id}</span>
                  <span>•</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    patientDetails.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {patientDetails.status}
                  </span>
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
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'medical'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Medical Info
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'appointments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Appointments History
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Reports & Documents
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'vitals'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Vital Signs
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="col-span-2 space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.name}
                          onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-800 mt-1">{patientDetails.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedData.dateOfBirth}
                          onChange={(e) => setEditedData({...editedData, dateOfBirth: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-800 mt-1">{patientDetails.dateOfBirth}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedData.email}
                          onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-800 mt-1">{patientDetails.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedData.phone}
                          onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-800 mt-1">{patientDetails.phone}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-blue-200">
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditedData(patientDetails)
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{appointmentHistory.length}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Appointments</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{medicalReports.length}</div>
                    <div className="text-xs text-gray-600 mt-1">Medical Reports</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">{patientDetails.currentMedications.length}</div>
                    <div className="text-xs text-gray-600 mt-1">Active Medications</div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Name</label>
                      <p className="text-sm text-gray-800 mt-1">{patientDetails.emergencyContact.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Relationship</label>
                      <p className="text-sm text-gray-800 mt-1">{patientDetails.emergencyContact.relationship}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Phone</label>
                      <p className="text-sm text-gray-800 mt-1">{patientDetails.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Insurance & Last Visit */}
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h4 className="text-sm font-bold text-gray-800 mb-3">Insurance Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Provider</label>
                      <p className="text-sm text-gray-800 mt-1">{patientDetails.insurance.provider}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Policy Number</label>
                      <p className="text-sm text-gray-800 mt-1 font-mono">{patientDetails.insurance.policyNumber}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Valid Until</label>
                      <p className="text-sm text-gray-800 mt-1">{patientDetails.insurance.validUntil}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="text-sm font-bold text-gray-800 mb-3">Last Visit</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Date</label>
                      <p className="text-sm text-gray-800 mt-1">{patientDetails.lastVisit}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Type</label>
                      <p className="text-sm text-gray-800 mt-1">{appointmentHistory[0]?.type}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Doctor</label>
                      <p className="text-sm text-gray-800 mt-1">{appointmentHistory[0]?.doctor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical Info Tab */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Medical Information</h3>
                {!isEditingMedical ? (
                  <button
                    onClick={() => setIsEditingMedical(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Medical Info
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsEditingMedical(false)
                        setEditedMedicalData({
                          bloodType: patientDetails.bloodType,
                          height: patientDetails.height,
                          weight: patientDetails.weight,
                          allergies: [...patientDetails.allergies],
                          chronicConditions: [...patientDetails.chronicConditions],
                          currentMedications: patientDetails.currentMedications.map(m => ({ ...m }))
                        })
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveMedical}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Physical Information</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                          <p className="text-2xl font-bold text-red-600 mt-1">{patientDetails.bloodType}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Height</label>
                        {isEditingMedical ? (
                          <input
                            type="text"
                            value={editedMedicalData.height}
                            onChange={(e) => setEditedMedicalData({...editedMedicalData, height: e.target.value})}
                            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 175 cm"
                          />
                        ) : (
                          <p className="text-xl font-semibold text-gray-800 mt-1">{patientDetails.height}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Weight</label>
                        {isEditingMedical ? (
                          <input
                            type="text"
                            value={editedMedicalData.weight}
                            onChange={(e) => setEditedMedicalData({...editedMedicalData, weight: e.target.value})}
                            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 80 kg"
                          />
                        ) : (
                          <p className="text-xl font-semibold text-gray-800 mt-1">{patientDetails.weight}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">BMI</label>
                        <p className="text-xl font-semibold text-gray-800 mt-1">26.1</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Allergies</h3>
                      {isEditingMedical && (
                        <button
                          onClick={handleAddAllergy}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isEditingMedical ? editedMedicalData.allergies : patientDetails.allergies).map((allergy, index) => (
                        <span key={index} className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-300 flex items-center gap-2">
                          ⚠️ {allergy}
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

                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Chronic Conditions</h3>
                      {isEditingMedical && (
                        <button
                          onClick={handleAddCondition}
                          className="px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {(isEditingMedical ? editedMedicalData.chronicConditions : patientDetails.chronicConditions).map((condition, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            {condition}
                          </div>
                          {isEditingMedical && (
                            <button
                              onClick={() => handleRemoveCondition(index)}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Current Medications</h3>
                      {isEditingMedical && (
                        <button
                          onClick={handleAddMedication}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {(isEditingMedical ? editedMedicalData.currentMedications : patientDetails.currentMedications).map((med, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          {isEditingMedical ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={med.name}
                                onChange={(e) => handleUpdateMedication(index, 'name', e.target.value)}
                                placeholder="Medication name"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) => handleUpdateMedication(index, 'dosage', e.target.value)}
                                placeholder="Dosage (e.g., 10mg)"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={med.frequency}
                                onChange={(e) => handleUpdateMedication(index, 'frequency', e.target.value)}
                                placeholder="Frequency (e.g., Once daily)"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => handleRemoveMedication(index)}
                                className="w-full px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="font-semibold text-gray-800">{med.name}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Dosage:</span> {med.dosage}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Frequency:</span> {med.frequency}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments History Tab */}
          {activeTab === 'appointments' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Appointment History ({appointmentHistory.length} visits)</h3>
              </div>
              <div className="space-y-4">
                {appointmentHistory.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{apt.date.split('-')[2]}</div>
                          <div className="text-xs text-gray-600">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">{apt.type}</h4>
                          <p className="text-sm text-gray-600">{apt.time} • {apt.doctor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {apt.method === 'Video' && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                            {getMethodIcon(apt.method)} Video
                          </span>
                        )}
                        {apt.method === 'Call' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                            {getMethodIcon(apt.method)} Call
                          </span>
                        )}
                        {apt.method === 'In-Person' && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                            {getMethodIcon(apt.method)} In-Person
                          </span>
                        )}
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-600">Diagnosis:</label>
                        <p className="text-sm text-gray-800 mt-1">{apt.diagnosis}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600">Prescription:</label>
                        <p className="text-sm text-gray-800 mt-1">{apt.prescription}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Medical Reports & Documents ({medicalReports.length} files)</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {medicalReports.map((report) => (
                  <div key={report.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 text-lg">{report.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">{report.type} • {report.date}</p>
                          <p className="text-xs text-gray-500 mt-1">Ordered by: {report.orderedBy}</p>
                          <div className="mt-2">
                            <p className="text-sm text-gray-700"><span className="font-medium">Results:</span> {report.results}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {report.status}
                        </span>
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vital Signs Tab */}
          {activeTab === 'vitals' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Vital Signs History</h3>
                  <p className="text-sm text-gray-600 mt-1">Track patient's vital signs over time</p>
                </div>
                <button
                  onClick={handleAddVitalSign}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Vital Sign
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Blood Pressure</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Heart Rate</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Temperature</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Weight</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedVitalSigns.map((vital, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <input
                            type="date"
                            value={vital.date}
                            onChange={(e) => handleUpdateVitalSign(index, 'date', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            value={vital.bp}
                            onChange={(e) => handleUpdateVitalSign(index, 'bp', e.target.value)}
                            placeholder="e.g., 120/80"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            value={vital.hr}
                            onChange={(e) => handleUpdateVitalSign(index, 'hr', e.target.value)}
                            placeholder="e.g., 72"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            value={vital.temp}
                            onChange={(e) => handleUpdateVitalSign(index, 'temp', e.target.value)}
                            placeholder="e.g., 98.6°F"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            value={vital.weight}
                            onChange={(e) => handleUpdateVitalSign(index, 'weight', e.target.value)}
                            placeholder="e.g., 80 kg"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleRemoveVitalSign(index)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {editedVitalSigns.length > 0 && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSaveVitalSigns}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Vital Signs
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center flex-shrink-0 bg-gray-50">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientProfileModal

