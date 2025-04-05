'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ParticipantDashboard = () => {
  const [hackathons, setHackathons] = useState([
    // Sample data - replace with actual API call
    {
      id: 1,
      title: 'AI Innovation Hackathon',
      date: '2024-05-15',
      location: 'Virtual',
      description: 'A hackathon focused on artificial intelligence and machine learning innovations.',
      status: 'Open',
      points: 100,
      participants: 120,
      difficulty: 'Intermediate',
    },
    {
      id: 2,
      title: 'Web3 Development Challenge',
      date: '2024-06-01',
      location: 'Hybrid',
      description: 'Build the future of decentralized applications.',
      status: 'Coming Soon',
      points: 150,
      participants: 85,
      difficulty: 'Advanced',
    },
    {
      id: 3,
      title: 'Mobile App Creation',
      date: '2024-07-10',
      location: 'In-Person',
      description: 'Design and develop innovative mobile applications.',
      status: 'Open',
      points: 80,
      participants: 95,
      difficulty: 'Beginner',
    },
    // Add more sample hackathons as needed
  ]);

  const [userStats, setUserStats] = useState({
    level: 3,
    experience: 750,
    nextLevel: 1000,
    completedHackathons: 2,
    badges: ['First Hackathon', 'Quick Learner', 'Team Player'],
    streak: 5,
  });

  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredHackathons = selectedFilter === 'all' 
    ? hackathons 
    : hackathons.filter(h => h.status.toLowerCase() === selectedFilter);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* User Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900 rounded-xl p-6 mb-12 shadow-lg border border-zinc-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative w-20 h-20 mr-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                <div className="absolute inset-1 rounded-full bg-black flex items-center justify-center">
                  <span className="text-2xl font-bold">Lv.{userStats.level}</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">Hacker Profile</h2>
                <div className="w-48 h-2 bg-zinc-800 rounded-full mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${(userStats.experience / userStats.nextLevel) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-zinc-400 mt-1">
                  {userStats.experience} / {userStats.nextLevel} XP
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.completedHackathons}</div>
                <div className="text-sm text-zinc-400">Hackathons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.streak}</div>
                <div className="text-sm text-zinc-400">Day Streak</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {userStats.badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-zinc-800 rounded-full text-xs border border-zinc-700"
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Available Hackathons</h1>
          <div className="flex space-x-2">
            {['all', 'open', 'coming soon'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedFilter === filter 
                    ? 'bg-white text-black' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Hackathon Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredHackathons.map((hackathon) => (
            <motion.div
              key={hackathon.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)" }}
              className="bg-zinc-900 overflow-hidden rounded-lg border border-zinc-800 hover:border-white transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{hackathon.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    hackathon.status === 'Open' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {hackathon.status}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-zinc-400">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(hackathon.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-zinc-400">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {hackathon.location}
                  </div>
                </div>
                
                <p className="mt-4 text-zinc-400">{hackathon.description}</p>
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-zinc-800 rounded-md p-2">
                    <div className="text-lg font-bold">{hackathon.points}</div>
                    <div className="text-xs text-zinc-400">Points</div>
                  </div>
                  <div className="bg-zinc-800 rounded-md p-2">
                    <div className="text-lg font-bold">{hackathon.participants}</div>
                    <div className="text-xs text-zinc-400">Participants</div>
                  </div>
                  <div className="bg-zinc-800 rounded-md p-2">
                    <div className="text-lg font-bold">{hackathon.difficulty}</div>
                    <div className="text-xs text-zinc-400">Level</div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Empty State */}
        {filteredHackathons.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <svg className="mx-auto h-16 w-16 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No hackathons found</h3>
            <p className="mt-1 text-zinc-400">Try changing your filters or check back later.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ParticipantDashboard; 