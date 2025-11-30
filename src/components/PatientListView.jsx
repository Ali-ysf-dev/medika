import React, { useState, useEffect } from 'react'
import PatientProfileModal from './PatientProfileModal'
import patientDataStore from '../store/patientDataStore'
import '../App.css'

function PatientListView() {
  const [patients, setPatients] = useState(patientDataStore.getPatients())
  const [allPatients, setAllPatients] = useState(patientDataStore.getPatients())
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [modalMode, setModalMode] = useState('view') // 'view', 'edit', 'add'
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    lastVisit: '',
    status: 'Active'
  })

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = patientDataStore.subscribe(() => {
      const updatedPatients = patientDataStore.getPatients()
      setAllPatients(updatedPatients)
      // Re-apply search filter if active
      if (searchTerm.trim()) {
        const filtered = updatedPatients.filter(patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm)
        )
        setPatients(filtered)
      } else {
        setPatients(updatedPatients)
      }
    })
    return unsubscribe
  }, [searchTerm])

  const handleSearch = (value) => {
    setSearchTerm(value)
    if (!value.trim()) {
      setPatients(allPatients)
      return
    }
    // TODO: Implement database search - await searchPatients(value)
    const filtered = allPatients.filter(patient =>
      patient.name.toLowerCase().includes(value.toLowerCase()) ||
      patient.email.toLowerCase().includes(value.toLowerCase()) ||
      patient.phone.includes(value)
    )
    setPatients(filtered)
  }

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowProfileModal(true)
  }

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient)
    setFormData(patient)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleAddPatient = () => {
    setSelectedPatient(null)
    setFormData({
      name: '',
      age: '',
      email: '',
      phone: '',
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'Active'
    })
    setModalMode('add')
    setShowModal(true)
  }

  const handleDeletePatient = (id) => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      // TODO: Delete from database - await deletePatient(id)
      patientDataStore.deletePatient(id)
      alert('Patient deleted successfully')
    }
  }

  const handleSavePatient = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }

    if (modalMode === 'edit') {
      // TODO: Update in database - await updatePatient(selectedPatient.id, formData)
      patientDataStore.updatePatient(selectedPatient.id, formData)
    } else if (modalMode === 'add') {
      // TODO: Create in database - await createPatient(formData)
      patientDataStore.addPatient(formData)
    }
    setShowModal(false)
  }


  return (
    <div className="w-full h-full p-8 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Patient List</h1>
          <p className="text-lg text-white/90 drop-shadow-md">View and manage patient information</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-[25px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Patients</h2>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Search patients..." 
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleAddPatient}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Patient
              </button>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
            <table className="w-full">
              <thead className="sticky top-0 z-20">
                <tr className="border-b-2 border-gray-200 bg-white">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Age</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Last Visit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 bg-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-700 font-medium">{patient.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{patient.age}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{patient.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{patient.phone}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{patient.lastVisit}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleViewPatient(patient)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleEditPatient(patient)}
                          className="px-3 py-1 text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>

      {/* Modal for View/Edit/Add Patient */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {modalMode === 'view' ? 'Patient Details' : modalMode === 'edit' ? 'Edit Patient' : 'Add New Patient'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                {modalMode === 'view' ? (
                  <p className="text-gray-900 py-2">{formData.name}</p>
                ) : (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                {modalMode === 'view' ? (
                  <p className="text-gray-900 py-2">{formData.age}</p>
                ) : (
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter age"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                {modalMode === 'view' ? (
                  <p className="text-gray-900 py-2">{formData.email}</p>
                ) : (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                {modalMode === 'view' ? (
                  <p className="text-gray-900 py-2">{formData.phone}</p>
                ) : (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                {modalMode === 'view' ? (
                  <p className="text-gray-900 py-2">{formData.lastVisit}</p>
                ) : (
                  <input
                    type="date"
                    value={formData.lastVisit}
                    onChange={(e) => setFormData({...formData, lastVisit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {modalMode === 'view' ? (
                  <p className="py-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(formData.status)}`}>
                      {formData.status}
                    </span>
                  </p>
                ) : (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {modalMode === 'view' ? (
                <>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setModalMode('edit')
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePatient}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Patient Profile Modal */}
      {showProfileModal && selectedPatient && (
        <PatientProfileModal
          patient={selectedPatient}
          onClose={() => setShowProfileModal(false)}
          onUpdate={(updatedPatient) => {
            patientDataStore.updatePatient(updatedPatient.id, updatedPatient)
          }}
        />
      )}
    </div>
  )
}

export default PatientListView

