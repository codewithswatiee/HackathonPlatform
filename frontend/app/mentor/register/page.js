"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function MentorRegistration() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    expertise: "",
    experience: "",
    linkedin: "",
    availability: "",
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

    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    // After successful registration, redirect to the dashboard
    router.push("/mentor/dashboard")
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
            <h2 className="text-3xl text-white tracking-tight">MENTOR REGISTRATION</h2>
            <p className="mt-2 text-gray-300 text-sm font-sans">Share your expertise and guide future innovators</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-5">
              <h3 className="text-xl text-white pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    placeholder="Email"
                    className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn Profile"
                    className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                </div>

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
            </div>

            <div className="space-y-5">
              <h3 className="text-xl text-white pb-2">Expertise & Availability</h3>
              
              <div className="space-y-5">
                <div className="relative">
                  <textarea
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    required
                    placeholder="Areas of Expertise (e.g., Web Development, ML, Cloud)"
                    rows="3"
                    className="pl-12 pr-4 py-3 w-full rounded-3xl bg-[#666666] border-none text-white placeholder-white shadow-sm focus:outline-none text-lg resize-none"
                  />
                  <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                    <span className="text-white text-xl">🧠</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white shadow-sm focus:outline-none appearance-none text-lg"
                    >
                      <option value="">Years of Experience</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-white text-xl">⏱️</span>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-white text-lg">▼</span>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      required
                      className="pl-12 pr-4 py-3 w-full rounded-full bg-[#666666] border-none text-white shadow-sm focus:outline-none appearance-none text-lg"
                    >
                      <option value="">Availability</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="weekdays">Weekdays Only</option>
                      <option value="flexible">Flexible</option>
                      <option value="limited">Limited Availability</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-white text-xl">📅</span>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-white text-lg">▼</span>
                    </div>
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