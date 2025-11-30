// Single source of truth for patient data
// This store manages all patient information including medical data

// Initialize with default patient data
const patientDataStore = {
  patients: [
    { id: 1, name: 'John Doe', age: 45, email: 'john.doe@email.com', phone: '+1 234-567-8900', lastVisit: '2024-01-10', status: 'Active' },
    { id: 2, name: 'Jane Smith', age: 32, email: 'jane.smith@email.com', phone: '+1 234-567-8901', lastVisit: '2024-01-08', status: 'Active' },
    { id: 3, name: 'Mike Johnson', age: 28, email: 'mike.j@email.com', phone: '+1 234-567-8902', lastVisit: '2024-01-05', status: 'Active' },
    { id: 4, name: 'Sarah Williams', age: 55, email: 'sarah.w@email.com', phone: '+1 234-567-8903', lastVisit: '2023-12-20', status: 'Inactive' },
    { id: 5, name: 'David Brown', age: 38, email: 'david.b@email.com', phone: '+1 234-567-8904', lastVisit: '2024-01-12', status: 'Active' },
    { id: 6, name: 'Emily Carter', age: 41, email: 'emily.c@email.com', phone: '+1 234-567-8905', lastVisit: '2024-01-14', status: 'Active' },
    { id: 7, name: 'Daniel Reed', age: 29, email: 'daniel.r@email.com', phone: '+1 234-567-8906', lastVisit: '2024-01-09', status: 'Inactive' },
    { id: 8, name: 'Laura Chen', age: 36, email: 'laura.c@email.com', phone: '+1 234-567-8907', lastVisit: '2024-01-07', status: 'Active' },
    { id: 9, name: 'Omar Ali', age: 47, email: 'omar.a@email.com', phone: '+1 234-567-8908', lastVisit: '2023-12-28', status: 'Active' },
    { id: 10, name: 'Priya Patel', age: 34, email: 'priya.p@email.com', phone: '+1 234-567-8909', lastVisit: '2024-01-03', status: 'Active' },
    { id: 11, name: 'David Lee', age: 39, email: 'david.l@email.com', phone: '+1 234-567-8910', lastVisit: '2023-12-18', status: 'Inactive' },
    { id: 12, name: 'Sofia Romero', age: 31, email: 'sofia.r@email.com', phone: '+1 234-567-8911', lastVisit: '2024-01-11', status: 'Active' },
    { id: 13, name: 'Ethan Walker', age: 27, email: 'ethan.w@email.com', phone: '+1 234-567-8912', lastVisit: '2024-01-06', status: 'Active' },
    { id: 14, name: 'Hannah Kim', age: 46, email: 'hannah.k@email.com', phone: '+1 234-567-8913', lastVisit: '2024-01-02', status: 'Inactive' },
    { id: 15, name: 'Marcus Brown', age: 50, email: 'marcus.b@email.com', phone: '+1 234-567-8914', lastVisit: '2023-12-15', status: 'Active' },
    { id: 16, name: 'Nina Alvarez', age: 33, email: 'nina.a@email.com', phone: '+1 234-567-8915', lastVisit: '2024-01-13', status: 'Active' },
    { id: 17, name: 'Greg Howard', age: 59, email: 'greg.h@email.com', phone: '+1 234-567-8916', lastVisit: '2023-12-05', status: 'Inactive' },
    { id: 18, name: 'Lucy Bennett', age: 37, email: 'lucy.b@email.com', phone: '+1 234-567-8917', lastVisit: '2024-01-04', status: 'Active' },
    { id: 19, name: 'Peter Wang', age: 42, email: 'peter.w@email.com', phone: '+1 234-567-8918', lastVisit: '2023-12-30', status: 'Active' },
    { id: 20, name: 'Olivia Green', age: 30, email: 'olivia.g@email.com', phone: '+1 234-567-8919', lastVisit: '2024-01-01', status: 'Active' },
  ],
  
  // Medical data for each patient (keyed by patient ID)
  medicalData: {
    1: {
      gender: 'Male',
      dateOfBirth: '1978-05-15',
      bloodType: 'O+',
      height: '175 cm',
      weight: '80 kg',
      allergies: ['Penicillin', 'Peanuts', 'Latex'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      currentMedications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily' }
      ],
      vitalSigns: [
        { date: '2024-01-10', bp: '130/85', hr: '72', temp: '98.6°F', weight: '80 kg' },
        { date: '2023-12-15', bp: '135/88', hr: '75', temp: '98.4°F', weight: '82 kg' },
        { date: '2023-11-20', bp: '128/82', hr: '70', temp: '98.6°F', weight: '83 kg' },
        { date: '2023-10-05', bp: '140/90', hr: '78', temp: '98.5°F', weight: '84 kg' },
      ],
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 234-567-8901'
      },
      insurance: {
        provider: 'HealthCare Plus',
        policyNumber: 'HC-123456789',
        validUntil: '2024-12-31'
      }
    }
  },
  
  // Subscribers for reactivity
  subscribers: new Set(),
  
  // Get all patients
  getPatients() {
    return this.patients
  },
  
  // Get patient by ID
  getPatient(id) {
    return this.patients.find(p => p.id === id)
  },
  
  // Get medical data for a patient
  getMedicalData(patientId) {
    return this.medicalData[patientId] || this.getDefaultMedicalData()
  },
  
  // Get default medical data structure
  getDefaultMedicalData() {
    return {
      gender: 'Male',
      dateOfBirth: '',
      bloodType: 'O+',
      height: '',
      weight: '',
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      vitalSigns: [],
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      },
      insurance: {
        provider: '',
        policyNumber: '',
        validUntil: ''
      }
    }
  },
  
  // Update patient basic info
  updatePatient(patientId, updates) {
    const index = this.patients.findIndex(p => p.id === patientId)
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...updates }
      this.notifySubscribers()
    }
  },
  
  // Update patient medical data
  updateMedicalData(patientId, medicalUpdates) {
    if (!this.medicalData[patientId]) {
      this.medicalData[patientId] = this.getDefaultMedicalData()
    }
    this.medicalData[patientId] = { ...this.medicalData[patientId], ...medicalUpdates }
    this.notifySubscribers()
  },
  
  // Add new patient
  addPatient(patient) {
    const newId = Math.max(...this.patients.map(p => p.id), 0) + 1
    const newPatient = { ...patient, id: newId }
    this.patients.push(newPatient)
    this.medicalData[newId] = this.getDefaultMedicalData()
    this.notifySubscribers()
    return newPatient
  },
  
  // Delete patient
  deletePatient(patientId) {
    this.patients = this.patients.filter(p => p.id !== patientId)
    delete this.medicalData[patientId]
    this.notifySubscribers()
  },
  
  // Subscribe to changes
  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  },
  
  // Notify all subscribers
  notifySubscribers() {
    this.subscribers.forEach(callback => callback())
  }
}

export default patientDataStore

