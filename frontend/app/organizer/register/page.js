"use client"

import axios from "axios"
import Head from "next/head"
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
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="min-h-screen bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Lilita One, cursive' }}>
        <div className="max-w-3xl mx-auto p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Organizer Registration</h2>
            <p className="mt-2 text-white">Create your organizer account to start hosting hackathons</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                      className="pl-10 pr-4 py-3 w-full rounded-full bg-[#777777] border-none text-white placeholder-white shadow-sm focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white">👤</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Username"
                      className="pl-10 pr-4 py-3 w-full rounded-full bg-[#777777] border-none text-white placeholder-white shadow-sm focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white">@</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email ID"
                      className="pl-10 pr-4 py-3 w-full rounded-full bg-[#777777] border-none text-white placeholder-white shadow-sm focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white">✉️</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Password"
                      className="pl-10 pr-4 py-3 w-full rounded-full bg-[#777777] border-none text-white placeholder-white shadow-sm focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white">🔒</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm Password"
                      className="pl-10 pr-4 py-3 w-full rounded-full bg-[#777777] border-none text-white placeholder-white shadow-sm focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white">🔒</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white pb-2">Organization Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      required
                      placeholder="Organization Name"
                      className="pl-10 pr-4 py-3 w-full rounded-full bg-[#777777] border-none text-white placeholder-white shadow-sm focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white">🏢</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      required
                      className="pl-10 pr-4 py-3 w-full rounded-full bg-[#777777] border-none text-white shadow-sm focus:outline-none appearance-none"
                    >
                      <option value="" disabled>Select Organization Type</option>
                      <option value="company">Company</option>
                      <option value="college">College</option>
                      <option value="committee">Committee</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-white">📋</span>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-white">▼</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="relative">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Organization Description"
                      rows="4"
                      className="pl-10 pr-4 py-3 w-full rounded-3xl bg-[#777777] border-none text-white placeholder-white shadow-sm focus:outline-none resize-none"
                    />
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <span className="text-white">📝</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-3 w-full max-w-xs rounded-full bg-white text-[#e74c3c] text-xl font-bold hover:bg-gray-100 focus:outline-none transition-all"
              >
                SIGN UP
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-white underline"
              >
                Cancel and return home
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
} 