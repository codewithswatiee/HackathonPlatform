'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { use } from 'react';

const CreateTeam = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const incomingCode = searchParams.get('code');
  const [teamCode, setTeamCode] = useState('');
  const [isJoining, setIsJoining] = useState(!!incomingCode);
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: isJoining ? 'Team Leader' : 'You (Team Leader)', role: 'Full Stack Developer', status: 'active' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTeamCode, setShowTeamCode] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  // Properly unwrap params using React.use()
  const { id: hackathonId } = use(params);

  useEffect(() => {
    if (isJoining) {
      setTeamCode(incomingCode);
      // Simulate checking team code
      const timer = setTimeout(() => {
        setTeamMembers(prev => [...prev, {
          id: prev.length + 1,
          name: 'You',
          role: 'Team Member',
          status: 'pending'
        }]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isJoining, incomingCode]);

  const handleTeamRegistration = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const teamData = {
        hackathonId,
        participantId: user._id,
        role: isJoining ? 'member' : 'leader',
        teamCode: isJoining ? teamCode : undefined
      };

      console.log(teamData);

      const response = await axios.post('http://localhost:7000/api/participant/register-hackathon', teamData);
      console.log(response.data);
      
      if (response.data.success) {
        if (!isJoining) {
          setTeamCode(response.data.teamCode);
          setShowTeamCode(true);
        } else {
          router.push(`/participant/hackathon/${hackathonId}/team-confirmation`);
        }
      } else {
        setError(response.data.message || 'Failed to register team');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while registering the team');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample data - replace with API call using params.id
  const hackathon = {
    id: params.id,
    name: 'AI Innovation Hackathon',
    description: 'Join us for an exciting hackathon focused on artificial intelligence and machine learning innovations.',
    theme: 'Artificial Intelligence for Social Good',
    date: '2024-05-15',
    time: '9:00 AM IST',
    venue: 'Virtual Event',
    applicationDeadline: '2024-05-01'
  };

  // Calculate time remaining
  const deadline = new Date(hackathon.applicationDeadline);
  const now = new Date();
  const timeRemaining = deadline - now;
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Header Box */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 mb-8"
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4">
            {isJoining ? 'Joining Team' : 'Create Team'}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-zinc-400 mb-4">
            {hackathon.name}
          </motion.p>
          <motion.div variants={itemVariants} className="flex items-center space-x-2 text-blue-400">
            <span className="font-semibold">Theme:</span>
            <span>{hackathon.theme}</span>
          </motion.div>
          
          {/* Team Code Section */}
          {!isJoining && (
            <motion.div
              variants={itemVariants}
              className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Team Joining Code</p>
                  <p className="text-2xl font-mono font-bold tracking-wider">{teamCode}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  onClick={() => navigator.clipboard.writeText(teamCode)}
                >
                  Copy Code
                </motion.button>
              </div>
              <p className="mt-2 text-sm text-zinc-500">Share this code with your team members to let them join your team</p>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Team Members */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
          >
            <motion.h2 variants={itemVariants} className="text-xl font-semibold mb-6">
              Team Members
            </motion.h2>
            <motion.div variants={itemVariants} className="space-y-4">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ x: 5 }}
                  className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-zinc-400">{member.role}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    member.status === 'active' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {member.status}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Section - Event Timeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
          >
            <motion.h2 variants={itemVariants} className="text-xl font-semibold mb-6">
              Event Timeline
            </motion.h2>
            <div className="space-y-6">
              <motion.div variants={itemVariants}>
                <p className="text-zinc-400">When</p>
                <p className="font-medium">{new Date(hackathon.date).toLocaleDateString()} at {hackathon.time}</p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-zinc-400">Where</p>
                <p className="font-medium">{hackathon.venue}</p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="text-zinc-400">Application Closes In</p>
                <p className="font-medium">{daysRemaining} days</p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              {isJoining ? (
                <motion.div className="space-y-4">
                  <p className="text-sm text-zinc-400 text-center">
                    Waiting for team leader to approve your request...
                  </p>
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.back()}
                    className="w-full py-3 bg-transparent border border-zinc-700 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Cancel Request
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTeamRegistration}
                    disabled={isLoading}
                    className={`w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Registering Team...' : isJoining ? 'Join Team' : 'Create Team'}
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.back()}
                    className="w-full py-3 bg-transparent border border-zinc-700 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Back
                  </motion.button>
                </>
              )}
            </div>

            {/* Add Team Code Display Section */}
            {showTeamCode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Team Joining Code</p>
                    <p className="text-2xl font-mono font-bold tracking-wider">{teamCode}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-500 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(teamCode);
                      // You can add a toast notification here if you want
                    }}
                  >
                    Copy Code
                  </motion.button>
                </div>
                <p className="mt-2 text-sm text-zinc-500">Share this code with your team members to let them join your team</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam; 