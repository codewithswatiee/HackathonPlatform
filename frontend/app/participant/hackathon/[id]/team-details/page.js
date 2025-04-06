'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { use } from 'react';

const TeamDetails = ({ params }) => {
  const router = useRouter();
  const { id: hackathonId } = use(params);

  // Sample team data
  const [team] = useState({
    teamCode: 'TECH2024',
    members: [
      {
        name: 'John Doe',
        role: 'Full Stack Developer',
        status: 'active'
      },
      {
        name: 'Jane Smith',
        role: 'UI/UX Designer',
        status: 'active'
      },
      {
        name: 'Mike Johnson',
        role: 'Backend Developer',
        status: 'active'
      },
      {
        name: 'Sarah Williams',
        role: 'Mobile Developer',
        status: 'active'
      }
    ]
  });

  // Provided hackathon data
  const [hackathon] = useState({
    name: 'Tech Innovators Hackathon 2024',
    description: 'A 48-hour hackathon focused on creating innovative solutions for real-world problems using cutting-edge technologies.',
    theme: 'Sustainable Technology Solutions',
    startDate: '2025-05-01T09:00:00.000Z',
    endDate: '2025-05-02T17:00:00.000Z',
    registrationStartDate: '2025-04-01T00:00:00.000Z',
    registrationEndDate: '2025-04-10T23:59:59.000Z',
    duration: '48 hours',
    time: {
      startTime: '09:00 AM',
      endTime: '05:00 PM'
    },
    location: {
      type: 'online'
    },
    registrationFee: 100,
    prizePool: 10000,
    prizeDistribution: [
      { position: 'First Prize', amount: 5000 },
      { position: 'Second Prize', amount: 3000 },
      { position: 'Third Prize', amount: 2000 }
    ],
    domains: [
      'Web Development',
      'Mobile Development',
      'AI/ML',
      'Blockchain',
      'IoT',
      'AR/VR'
    ],
    maxTeamSize: 4,
    minTeamSize: 2,
    rules: [
      'All code must be written during the hackathon',
      'Teams must submit their project before the deadline',
      'No use of pre-built templates or frameworks',
      'All team members must be present during the presentation',
      'Projects must be original and not previously submitted'
    ],
    judgingCriteria: [
      { criterion: 'Innovation', weightage: 30 },
      { criterion: 'Technical Implementation', weightage: 30 },
      { criterion: 'User Experience', weightage: 20 },
      { criterion: 'Presentation', weightage: 20 }
    ],
    status: 'upcoming'
  });

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Team Info */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h1 className="text-3xl font-bold mb-4">Team Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Team Code</h2>
                <p className="text-2xl font-mono font-bold tracking-wider">{team.teamCode}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Hackathon</h2>
                <p className="text-xl">{hackathon.name}</p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {team.members.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
                >
                  <h3 className="font-semibold mb-2">{member.name}</h3>
                  <p className="text-sm text-zinc-400">{member.role}</p>
                  <span className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    member.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {member.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Event Timeline */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Event Timeline</h2>
            <div className="relative">
              <div className="absolute top-5 left-5 w-0.5 h-[calc(100%-40px)] bg-zinc-800"></div>
              <div className="space-y-8">
                {[
                  { phase: 'Registration Opens', date: hackathon.registrationStartDate },
                  { phase: 'Registration Deadline', date: hackathon.registrationEndDate },
                  { phase: 'Hackathon Begins', date: hackathon.startDate },
                  { phase: 'Hackathon Ends', date: hackathon.endDate }
                ].map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-10"
                  >
                    <div className="absolute left-[15px] w-3 h-3 rounded-full transform -translate-x-1/2 bg-blue-500"></div>
                    <div>
                      <h3 className="font-semibold text-lg">{event.phase}</h3>
                      <p className="text-zinc-400 text-sm">
                        {new Date(event.date).toLocaleDateString()} at {index === 0 ? '12:00 AM' : index === 1 ? '11:59 PM' : hackathon.time.startTime}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Hackathon Details */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Hackathon Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Theme</h3>
                <p className="text-zinc-400">{hackathon.theme}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Duration</h3>
                <p className="text-zinc-400">{hackathon.duration}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                <p className="text-zinc-400 capitalize">{hackathon.location.type}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Registration Fee</h3>
                <p className="text-zinc-400">₹{hackathon.registrationFee}</p>
              </div>
            </div>
          </div>

          {/* Prize Pool */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Prize Pool</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hackathon.prizeDistribution.map((prize, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-800 rounded-lg p-4 text-center"
                >
                  <h3 className="text-lg font-semibold mb-2">{prize.position}</h3>
                  <p className="text-2xl font-bold text-blue-400">₹{prize.amount}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamDetails; 