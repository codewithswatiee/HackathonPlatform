"use client"

import { motion } from "framer-motion"

export default function OrganizerDashboard() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Organizer Dashboard</h1>
        <p className="text-zinc-400">Welcome to your organizer dashboard. This page is under construction.</p>
      </motion.div>
    </div>
  )
} 