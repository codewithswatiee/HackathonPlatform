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
    mode: 'online', // online/offline/hybrid
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
    // Here you would typically send the data to your backend
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <motion.button
            onClick={() => setShowAddHackathon(true)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add New Hackathon
          </motion.button>
        </div>

        {/* Add Hackathon Modal */}
        {showAddHackathon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Hackathon</h2>
                <button
                  onClick={() => setShowAddHackathon(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="hackathonName"
                  value={hackathonForm.hackathonName}
                  onChange={handleChange}
                  placeholder="Hackathon Name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />

                <textarea
                  name="description"
                  value={hackathonForm.description}
                  onChange={handleChange}
                  placeholder="Hackathon Description"
                  required
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={hackathonForm.startDate}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={hackathonForm.endDate}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="expectedParticipants"
                    value={hackathonForm.expectedParticipants}
                    onChange={handleChange}
                    placeholder="Expected Participants"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  
                  <select
                    name="mode"
                    value={hackathonForm.mode}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                    <input
                      type="date"
                      name="registrationDeadline"
                      value={hackathonForm.registrationDeadline}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    name="prizesWorth"
                    value={hackathonForm.prizesWorth}
                    onChange={handleChange}
                    placeholder="Prizes Worth"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <textarea
                  name="rules"
                  value={hackathonForm.rules}
                  onChange={handleChange}
                  placeholder="Rules and Guidelines"
                  required
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />

                <div className="flex justify-end space-x-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddHackathon(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Hackathon
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Placeholder for list of created hackathons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Hackathons</h2>
          <p className="text-gray-500">No hackathons created yet. Click "Add New Hackathon" to get started!</p>
        </div>
      </div>
    </div>
  );
} 