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
  const [hackathon, setHackathon] = useState(null);
  const { user } = useSelector((state) => state.auth);
  
  // Properly unwrap params using React.use()
  const { id: hackathonId } = use(params);

  // Fetch hackathon details
  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/organizers/hackathons/${hackathonId}`);
        
        if (response.status !== 200) {
          setError('Could not find Hackathon details');
          return;
        }

        setHackathon(response.data.hackathon);
      } catch (error) {
        console.error('Error fetching hackathon details:', error);
        setError(error.message || 'Failed to fetch hackathon details');
      }
    };

    fetchHackathonDetails();
  }, [hackathonId]);

  // Fetch team details if user is a team leader
  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (user._id && user.registeredHackathon === hackathonId) {
        try {
          const response = await axios.post('http://localhost:7000/api/participant/fetch-team', {
            participantId: user._id,
            hackathonId
          });

          console.log(response.data)

          if (response.data.member) {
            // If team exists, redirect to team confirmation page
            router.push(`/participant/hackathon/${hackathonId}/team-confirmation`);
          }
        } catch (error) {
          console.error('Error fetching team details:', error);
        }
      }
    };

    fetchTeamDetails();
  }, [hackathonId, router]);

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

      const response = await axios.post('http://localhost:7000/api/participant/register-hackathon', teamData);
      
      if (response.data.success) {
        if (!isJoining) {
          // For team leaders, show the team code and redirect after 2 seconds
          setTeamCode(response.data.teamCode);
          setShowTeamCode(true);
          
          setTimeout(() => {
            router.push(`/participant/hackathon/${hackathonId}/team-confirmation`);
          }, 2000);
        } else {
          // For team members, show success message and redirect
          setTeamCode(response.data.teamCode);
          setShowTeamCode(true);
          setTimeout(() => {
            router.push(`/participant/hackathon/${hackathonId}/team-confirmation`);
          }, 2000);
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

  // Calculate time remaining
  const deadline = new Date(hackathon?.registrationEndDate);
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
            {hackathon?.name}
          </motion.p>
          <motion.div variants={itemVariants} className="flex items-center space-x-2 text-blue-400">
            <span className="font-semibold">Theme:</span>
            <span>{hackathon?.theme}</span>
          </motion.div>
          
          {/* Team Code Section */}
          {showTeamCode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-zinc-800 rounded-lg border border-zinc-700"
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
              <p className="mt-2 text-sm text-zinc-500">
                Share this code with your team members. You'll be redirected to the confirmation page once your team is full (4 members).
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Hackathon Details Section */}
        {hackathon && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Info */}
              <div>
                <h1 className="text-4xl font-bold mb-4">{hackathon.name}</h1>
                <p className="text-lg text-zinc-400 mb-6">{hackathon.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <span className="font-semibold">Theme:</span>
                    <span>{hackathon.theme}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <span className="font-semibold">Duration:</span>
                    <span>{hackathon.duration}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-zinc-300">
                    <span className="font-semibold">Location:</span>
                    <span className="capitalize">{hackathon.location.type}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-zinc-300">
                    <span className="font-semibold">Registration Fee:</span>
                    <span>₹{hackathon.registrationFee}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Dates and Team Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Event Schedule</h3>
                  <div className="space-y-2 text-zinc-300">
                    <p>Start: {new Date(hackathon.startDate).toLocaleDateString()} at {hackathon.time.startTime}</p>
                    <p>End: {new Date(hackathon.endDate).toLocaleDateString()} at {hackathon.time.endTime}</p>
                    <p>Registration Closes: {new Date(hackathon.registrationEndDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Team Requirements</h3>
                  <div className="space-y-2 text-zinc-300">
                    <p>Minimum Team Size: {hackathon.minTeamSize} members</p>
                    <p>Maximum Team Size: {hackathon.maxTeamSize} members</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Prize Pool</h3>
                  <div className="space-y-2 text-zinc-300">
                    <p className="text-lg font-medium">Total: ₹{hackathon.prizePool}</p>
                    <div className="space-y-1">
                      {hackathon.prizeDistribution.map((prize, index) => (
                        <p key={index}>{prize.position}: ₹{prize.amount}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Domains Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Domains</h3>
              <div className="flex flex-wrap gap-2">
                {hackathon.domains.map((domain, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Team Members Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Action Buttons */}
          <div className="space-y-4">
            {!showTeamCode && (
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
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam; 