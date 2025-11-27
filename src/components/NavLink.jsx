import React from 'react'

const NavLink = ({ content, view, activeView, onClick }) => {
  const isActive = activeView === view
  
  return (
    <li className='list-none'>
      <button 
        onClick={() => onClick(view)}
        className={`no-underline text-black w-full py-2 px-4 rounded-lg transition-all duration-200 ${
          isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
        }`}
      >
        {content}
      </button>
    </li>
  )
}

export default NavLink