import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'

function LoginForm({setIsLoggedIn}) {
  const formRef = useRef(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert('Passwords do not match!')
        return
      }
      // Handle signup logic here
      console.log('Sign Up:', { email, password })
      
      // Animate form out
      if (formRef.current) {
        // Start showing new content before form completely disappears
        setTimeout(() => {
          setIsLoggedIn(true)
        }, 400) // Halfway through the animation
        
        gsap.to(formRef.current, {
          opacity: 0,
          scale: 0.95,
          y: -20,
          duration: 0.8,
          ease: "power4.out"
        })
      } else {
        setIsLoggedIn(true)
      }
    } else {
      // Handle login logic here
      console.log('Login:', { email, password })
      
      // Animate form out
      if (formRef.current) {
        // Start showing new content before form completely disappears
        setTimeout(() => {
          setIsLoggedIn(true)
        }, 400) // Halfway through the animation
        
        gsap.to(formRef.current, {
          opacity: 0,
          scale: 0.95,
          y: -20,
          duration: 0.8,
          ease: "power4.out"
        })
      } else {
        setIsLoggedIn(true)
      }
    }
  }

  const toggleForm = () => {
    setIsSignUp(!isSignUp)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="flex items-center justify-center h-full w-full p-8">
      <form 
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-sm rounded-[40px] p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.3),0_10px_30px_rgba(0,0,0,0.2),0_5px_15px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.5)] border border-white/20"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
        </p>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-[20px] border-2 border-gray-200 bg-white/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.05)]"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-[20px] border-2 border-gray-200 bg-white/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.05)]"
            placeholder="Enter your password"
            required
          />
        </div>

        {isSignUp && (
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[20px] border-2 border-gray-200 bg-white/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.05)]"
              placeholder="Confirm your password"
              required
            />
          </div>
        )}

        {!isSignUp && (
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              Forgot password?
            </a>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-[20px] shadow-[0_8px_20px_rgba(59,130,246,0.4),0_4px_10px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_30px_rgba(59,130,246,0.5),0_6px_15px_rgba(59,130,246,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={toggleForm}
            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </form>
    </div>
  )
}

export default LoginForm

