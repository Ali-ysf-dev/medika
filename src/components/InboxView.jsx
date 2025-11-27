import React, { useState, useEffect } from 'react'
import '../App.css'

function InboxView() {
  // TODO: Replace with database fetch - useEffect(() => { fetchInboxEmails() }, [])
  // Sample data - emails with patient information
  const [allEmails] = useState([
    { 
      id: 1, 
      subject: 'Appointment Request', 
      message: 'I would like to schedule an appointment for next week.',
      patientId: 1,
      patientName: 'John Doe',
      patientEmail: 'john.doe@email.com',
      patientStatus: 'Active',
      date: '2024-01-15',
      time: '10:30 AM',
      read: false
    },
    { 
      id: 2, 
      subject: 'Follow-up Question', 
      message: 'I have a question about my recent prescription.',
      patientId: 2,
      patientName: 'Jane Smith',
      patientEmail: 'jane.smith@email.com',
      patientStatus: 'Active',
      date: '2024-01-15',
      time: '2:15 PM',
      read: false
    },
    { 
      id: 3, 
      subject: 'Test Results Inquiry', 
      message: 'When will my test results be available?',
      patientId: 3,
      patientName: 'Mike Johnson',
      patientEmail: 'mike.j@email.com',
      patientStatus: 'Active',
      date: '2024-01-14',
      time: '9:45 AM',
      read: true
    },
    { 
      id: 4, 
      subject: 'Medication Refill', 
      message: 'I need a refill for my medication.',
      patientId: 4,
      patientName: 'Sarah Williams',
      patientEmail: 'sarah.w@email.com',
      patientStatus: 'Inactive',
      date: '2024-01-13',
      time: '11:20 AM',
      read: false
    },
    { 
      id: 5, 
      subject: 'Urgent: Pain Management', 
      message: 'I am experiencing severe pain and need immediate attention.',
      patientId: 5,
      patientName: 'David Brown',
      patientEmail: 'david.b@email.com',
      patientStatus: 'Active',
      date: '2024-01-16',
      time: '8:00 AM',
      read: false
    },
    { 
      id: 6, 
      subject: 'Appointment Confirmation', 
      message: 'Thank you for confirming my appointment.',
      patientId: 6,
      patientName: 'Emily Davis',
      patientEmail: 'emily.d@email.com',
      patientStatus: 'Active',
      date: '2024-01-15',
      time: '4:30 PM',
      read: true
    },
  ])

  // Filter emails to only show those from active/available patients
  const availableEmails = allEmails.filter(email => email.patientStatus === 'Active')

  const [selectedEmail, setSelectedEmail] = useState(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [forwardTo, setForwardTo] = useState('')
  const [forwardNote, setForwardNote] = useState('')

  const handleEmailClick = (email) => {
    setSelectedEmail(email)
    // TODO: Mark email as read in database
    // await markEmailAsRead(email.id)
  }

  const handleReply = () => {
    setReplyText('')
    setShowReplyModal(true)
  }

  const handleSendReply = () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message')
      return
    }
    // TODO: Send reply to database - await sendReply(selectedEmail.id, replyText)
    alert('Reply sent successfully!')
    setShowReplyModal(false)
    setReplyText('')
  }

  const handleForward = () => {
    setForwardTo('')
    setForwardNote('')
    setShowForwardModal(true)
  }

  const handleSendForward = () => {
    if (!forwardTo.trim()) {
      alert('Please enter a recipient email')
      return
    }
    // TODO: Forward email to database - await forwardEmail(selectedEmail.id, forwardTo, forwardNote)
    alert('Email forwarded successfully!')
    setShowForwardModal(false)
    setForwardTo('')
    setForwardNote('')
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      // TODO: Delete from database - await deleteEmail(selectedEmail.id)
      alert('Email deleted successfully!')
      setSelectedEmail(null)
    }
  }

  return (
    <div className="w-full h-full p-8 overflow-hidden flex flex-col">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Inbox</h1>
        <p className="text-lg text-white/90 drop-shadow-md">View emails from your patients</p>
      </div>

      <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-[25px] p-6 shadow-[0_10px_30px_rgba(120,130,150,0.12),0_4px_10px_rgba(120,130,150,0.1),inset_0_8px_16px_rgba(120,130,150,0.12),inset_0_4px_8px_rgba(120,130,150,0.1),inset_0_2px_4px_rgba(120,130,150,0.06)] flex gap-6 overflow-hidden">
        {/* Email List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto hide-scrollbar flex flex-col">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Emails</h2>
            <p className="text-sm text-gray-600">{availableEmails.length} messages</p>
          </div>
          
          <div className="flex-1 space-y-2">
            {availableEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedEmail?.id === email.id
                    ? 'border-blue-500 bg-blue-50'
                    : email.read
                    ? 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-semibold truncate ${email.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {email.subject}
                      </h3>
                      {!email.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{email.message}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {email.patientName.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-600">{email.patientName}</span>
                  </div>
                  <span className="text-xs text-gray-500">{email.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Detail */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedEmail.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{selectedEmail.patientName}</p>
                        <p className="text-xs text-gray-600">{selectedEmail.patientEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{selectedEmail.date}</p>
                    <p className="text-xs text-gray-500">{selectedEmail.time}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedEmail.message}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                <button 
                  onClick={handleReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reply
                </button>
                <button 
                  onClick={handleForward}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Forward
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 text-lg">Select an email to view</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Reply to {selectedEmail?.patientName}</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Original message:</p>
              <p className="text-sm text-gray-800 italic">"{selectedEmail?.message}"</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
                placeholder="Type your reply here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Forward Email</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">From: {selectedEmail?.patientName}</p>
              <p className="text-sm text-gray-600 mb-2">Subject: {selectedEmail?.subject}</p>
              <p className="text-sm text-gray-800">"{selectedEmail?.message}"</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Forward To (Email)</label>
              <input
                type="email"
                value={forwardTo}
                onChange={(e) => setForwardTo(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add a Note (Optional)</label>
              <textarea
                value={forwardNote}
                onChange={(e) => setForwardNote(e.target.value)}
                rows={3}
                placeholder="Add a message to the forwarded email..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForwardModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendForward}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Forward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InboxView

