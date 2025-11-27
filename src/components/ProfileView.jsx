import React, { useState } from 'react'
import '../App.css'

function ProfileView() {
  // TODO: Replace with database fetch - useEffect(() => { fetchProfile() }, [])
  const [profile, setProfile] = useState({
    firstName: 'Dr.',
    lastName: 'Name',
    email: 'doctor@example.com',
    phone: '+1 (555) 000-0000',
    specialization: 'Cardiology',
    licenseNumber: 'MD-12345',
    yearsOfExperience: '10',
    bio: 'Experienced physician dedicated to providing quality healthcare.',
    address: '123 Medical Center Dr',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    website: 'https://doctorwebsite.com',
    profileImage: null
  })

  const [isEditing, setIsEditing] = useState(false)
  const [originalProfile, setOriginalProfile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          profileImage: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = () => {
    setOriginalProfile({ ...profile })
    setIsEditing(true)
  }

  const handleSave = async () => {
    // TODO: Save to database - await updateProfile(profile)
    try {
      // await fetch('/api/profile', { method: 'PUT', body: JSON.stringify(profile) })
      setIsEditing(false)
      setOriginalProfile(null)
      alert('Profile updated successfully!')
    } catch {
      alert('Error updating profile')
    }
  }

  const handleCancel = () => {
    if (originalProfile) {
      setProfile(originalProfile)
    }
    setIsEditing(false)
    setOriginalProfile(null)
  }

  return (
    <div className="w-full h-full p-6 overflow-hidden flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">Profile</h1>
        <p className="text-sm text-white/90 drop-shadow-md">Manage your professional information</p>
      </div>

      <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-[20px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] overflow-hidden flex flex-col">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden shadow-lg">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {profile.firstName?.[0] || profile.lastName?.[0] || 'D'}
                </span>
              )}
            </div>
            {isEditing && (
              <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {profile.firstName} {profile.lastName}
              </h2>
            )}
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                placeholder="Specialization"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-600">{profile.specialization}</p>
            )}
          </div>
          <div className="flex-shrink-0">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Contact</h3>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.website}</p>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Professional</h3>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">License Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="licenseNumber"
                    value={profile.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.licenseNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Experience</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={profile.yearsOfExperience}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.yearsOfExperience} years</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Specialization</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.specialization}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Address</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Street</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.address}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.city}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={profile.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.state}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Zip Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="zipCode"
                    value={profile.zipCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.zipCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Bio</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView

