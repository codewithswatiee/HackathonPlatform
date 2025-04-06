'use client';

import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';

const JoinTeam = ({ params }) => {
  const router = useRouter();
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState('');
  const participantId = useSelector(state => state.auth.user)
  const { id: hackathonId } = use(params);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!teamCode.trim()) {
      setError('Please enter a team code');
      return;
    }
    // Here you would validate the team code with your backend
    // For now, we'll simulate a successful join

    const response = await axios.post('http://localhost:7000/api/participant/register-hackathon', {
      teamCode,
      hackathonId,
      participantId,
      role: 'member'
    })

    if(response.data.error){
      alert('Something went wrong! Please try later');
    }

    alert(response.data.message)
    router.push(`/participant/hackathon/${hackathonId}/create-team?code=${teamCode}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-6">Join a Team</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Enter Team Code
                </label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={teamCode}
                    onChange={(e) => {
                      setTeamCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg
                      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                      placeholder-zinc-500 text-lg font-mono tracking-wider uppercase"
                    maxLength={6}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-white text-black rounded-lg font-medium 
                    hover:bg-zinc-200 transition-colors"
                >
                  Join Team
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-3 bg-transparent border border-zinc-700 
                    rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                >
                  Back
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
          >
            <h3 className="text-sm font-medium text-zinc-300 mb-2">How to join?</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-400">
              <li>Get the 6-digit team code from your team leader</li>
              <li>Enter the code in the field above</li>
              <li>Click "Join Team" to become a team member</li>
            </ol>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinTeam; 