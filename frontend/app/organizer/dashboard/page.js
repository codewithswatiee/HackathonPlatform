"use client"

import HackathonCard from '@/app/components/HackathonCard'
import { motion } from "framer-motion"
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function OrganizerDashboard() {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch hackathons from localStorage
    const fetchHackathons = () => {
      try {
        const storedHackathons = JSON.parse(localStorage.getItem('hackathons') || '[]')
        setHackathons(storedHackathons)
      } catch (error) {
        console.error('Error fetching hackathons:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHackathons()

    // Listen for storage events to update the dashboard when hackathons are added
    const handleStorageChange = (e) => {
      if (e.key === 'hackathons') {
        fetchHackathons()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <Link href="/organizer/hackathon/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            + Add Hackathon
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-zinc-400">Loading hackathons...</p>
          </div>
        ) : hackathons.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 rounded-xl">
            <p className="text-zinc-400">No hackathons created yet.</p>
            <p className="text-zinc-500 text-sm mt-2">Click the Add Hackathon button to create your first hackathon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
} 