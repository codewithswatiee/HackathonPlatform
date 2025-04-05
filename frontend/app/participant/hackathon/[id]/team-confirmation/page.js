'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const TeamConfirmation = ({ params }) => {
  const [registeredTeams, setRegisteredTeams] = useState(42); // Sample data
  
  useEffect(() => {
    // Subtle confetti animation
    const duration = 1500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 20, spread: 200, ticks: 20, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 10;

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.3, 0.7), y: randomInRange(0.3, 0.5) },
        colors: ['#3b82f6', '#ffffff'],
        gravity: 0.8,
        scalar: 0.9
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Sample event schedule data
  const schedule = [
    { phase: 'Registration', date: '2024-05-01', time: '09:00 AM', status: 'completed' },
    { phase: 'Team Formation', date: '2024-05-05', time: '11:59 PM', status: 'current' },
    { phase: 'Kickoff Meeting', date: '2024-05-15', time: '10:00 AM', status: 'upcoming' },
    { phase: 'Development Phase', date: '2024-05-15', time: '11:00 AM', status: 'upcoming' },
    { phase: 'Mid-Review', date: '2024-05-20', time: '02:00 PM', status: 'upcoming' },
    { phase: 'Final Submission', date: '2024-05-25', time: '11:59 PM', status: 'upcoming' },
    { phase: 'Presentations', date: '2024-05-26', time: '10:00 AM', status: 'upcoming' },
    { phase: 'Awards Ceremony', date: '2024-05-26', time: '04:00 PM', status: 'upcoming' }
  ];

  const rules = [
    'Teams must have 2-4 members',
    'All team members must be registered participants',
    'Each team must submit their project before the deadline',
    'Code must be original and created during the hackathon',
    'Use of third-party libraries and APIs is allowed',
    'Teams must present their project to the judges'
  ];

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
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Success Message */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Team Created Successfully! 🎉</h1>
            <p className="text-zinc-400">Your team is now registered for the hackathon</p>
          </motion.div>

          {/* Event Schedule */}
          <motion.div
            variants={itemVariants}
            className="bg-zinc-900 rounded-xl p-8 border border-zinc-800"
          >
            <h2 className="text-2xl font-bold mb-6">Event Schedule</h2>
            <div className="relative">
              <div className="absolute top-5 left-5 w-0.5 h-[calc(100%-40px)] bg-zinc-800"></div>
              <div className="space-y-8">
                {schedule.map((event, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative pl-10"
                  >
                    <div className={`absolute left-[15px] w-3 h-3 rounded-full transform -translate-x-1/2
                      ${event.status === 'completed' ? 'bg-green-500' : 
                        event.status === 'current' ? 'bg-blue-500' : 'bg-zinc-600'}`}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{event.phase}</h3>
                        <p className="text-zinc-400 text-sm">
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </p>
                      </div>
                      <span className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-medium rounded-full
                        ${event.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          event.status === 'current' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-zinc-500/20 text-zinc-400'}`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Rules and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rules */}
            <motion.div
              variants={itemVariants}
              className="bg-zinc-900 rounded-xl p-8 border border-zinc-800"
            >
              <h2 className="text-2xl font-bold mb-6">Rules</h2>
              <ul className="space-y-4">
                {rules.map((rule, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <span className="text-blue-400 mr-3">•</span>
                    <span className="text-zinc-300">{rule}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="bg-zinc-900 rounded-xl p-8 border border-zinc-800"
            >
              <h2 className="text-2xl font-bold mb-6">Event Stats</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-zinc-800/50 rounded-lg">
                  <p className="text-4xl font-bold text-blue-400 mb-2">{registeredTeams}</p>
                  <p className="text-zinc-400">Registered Teams</p>
                </div>
                <div className="text-center p-6 bg-zinc-800/50 rounded-lg">
                  <p className="text-4xl font-bold text-blue-400 mb-2">8</p>
                  <p className="text-zinc-400">Days Until Kickoff</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamConfirmation; 