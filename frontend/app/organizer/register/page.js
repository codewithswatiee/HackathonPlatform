"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function OrganizerRegistration() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationType: "",
    description: "",
    email: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    const response = await axios.post('http://localhost:7000/api/organizers/register', {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
      description: formData.description,
    })

    if(response.status === 201) {
      alert("Registration successful!")
      router.push("/organizer/dashboard")
    } else {
      alert("Registration failed! Please try again later!")
    }
  }

  return (
    <main className="min-h-screen bg-zinc-900 font-['Lilita_One']">
      {/* Google Fonts Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
      `}</style>
      
      <div className="flex items-center justify-center min-h-screen py-8 px-6">
        <div className="w-full max-w-4xl bg-zinc-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl text-white tracking-tight">ORGANIZER REGISTRATION</h2>
            <p className="mt-2 text-gray-300 text-sm font-sans">Create your account to start hosting hackathons</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First row with name field */}
            <div className="grid grid-cols-1 gap-5">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-white text-xl">👤</span>
                </div>
              </div>
            </div>
            
            {/* Second row with username, email, org name in one line */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Username"
                  className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-white text-xl">@</span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email ID"
                  className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-white text-xl">✉️</span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  placeholder="Organization Name"
                  className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-white text-xl">🏢</span>
                </div>
              </div>
            </div>

            {/* Third row with password and confirm password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-white text-xl">🔒</span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm Password"
                  className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-white text-xl">🔒</span>
                </div>
              </div>
            </div>

            {/* Fourth row with org type and description */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="relative">
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  required
                  className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white shadow-sm focus:outline-none appearance-none text-lg"
                >
                  <option value="" disabled>Organization Type</option>
                  <option value="company">Company</option>
                  <option value="college">College</option>
                  <option value="committee">Committee</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-white text-xl">📋</span>
                </div>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-white text-lg">▼</span>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="relative">
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Organization Description"
                    className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-white text-xl">📝</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 mt-3">
              <div>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="w-full py-3 rounded-full bg-gray-700 text-white text-xl hover:bg-gray-600 focus:outline-none transition-all"
                >
                  CANCEL
                </button>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-full bg-white text-[#e74c3c] text-xl hover:bg-gray-100 focus:outline-none transition-all"
                >
                  SIGN UP
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 