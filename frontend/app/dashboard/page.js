'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Dashboard() {
  const [showAddHackathon, setShowAddHackathon] = useState(false);
  const [hackathonForm, setHackathonForm] = useState({
    hackathonName: '',
    description: '',
    startDate: '',
    endDate: '',
    expectedParticipants: '',
    mode: 'online',
    registrationDeadline: '',
    prizesWorth: '',
    rules: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHackathonForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Hackathon form submitted:', hackathonForm);
    setShowAddHackathon(false);
    setHackathonForm({
      hackathonName: '',
      description: '',
      startDate: '',
      endDate: '',
      expectedParticipants: '',
      mode: 'online',
      registrationDeadline: '',
      prizesWorth: '',
      rules: '',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <motion.button
            onClick={() => setShowAddHackathon(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Add New Hackathon
          </motion.button>
        </motion.div>

        {showAddHackathon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-2xl border border-zinc-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Hackathon</h2>
                <motion.button
                  onClick={() => setShowAddHackathon(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Hackathon Name *</label>
                    <input
                      type="text"
                      name="hackathonName"
                      value={hackathonForm.hackathonName}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={hackathonForm.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={hackathonForm.startDate}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">End Date *</label>
                      <input
                        type="date"
                        name="endDate"
                        value={hackathonForm.endDate}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Expected Participants *</label>
                      <input
                        type="number"
                        name="expectedParticipants"
                        value={hackathonForm.expectedParticipants}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Mode *</label>
                      <select
                        name="mode"
                        value={hackathonForm.mode}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Registration Deadline *</label>
                      <input
                        type="date"
                        name="registrationDeadline"
                        value={hackathonForm.registrationDeadline}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Prizes Worth *</label>
                      <input
                        type="text"
                        name="prizesWorth"
                        value={hackathonForm.prizesWorth}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Rules and Guidelines *</label>
                    <textarea
                      name="rules"
                      value={hackathonForm.rules}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent"
                    />
                  </motion.div>
                </motion.div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-zinc-800">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddHackathon(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 border border-zinc-700 rounded-lg text-white hover:bg-zinc-800"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-white text-black rounded-lg hover:bg-zinc-200"
                  >
                    Create Hackathon
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-zinc-900 rounded-lg shadow p-6 border border-zinc-800"
        >
          <h2 className="text-xl font-semibold mb-4">Your Hackathons</h2>
          <p className="text-zinc-400">No hackathons created yet. Click "Add New Hackathon" to get started!</p>
        </motion.div>
      </div>
    </div>
  );
} 