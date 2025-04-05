'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const TeamConfirmation = ({ params }) => {
  const [registeredTeams, setRegisteredTeams] = useState(42); // Sample data
  const [confetti, setConfetti] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const scrollRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const pathLength = useSpring(scrollXProgress, { stiffness: 400, damping: 90 });

  useEffect(() => {
    // Dynamically import confetti only on client side
    import('canvas-confetti').then((confettiModule) => {
      setConfetti(() => confettiModule.default);
    });

    // Fetch timeline data
    // This is mock data - replace with actual API call
    const mockTimelineData = [
      {
        phase: "Orientation & Kickoff",
        date: "2024-05-15",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        description: "Welcome session, rules explanation, and team introductions",
        status: 'upcoming'
      },
      {
        phase: "Team Formation & Networking",
        date: "2024-05-15",
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        description: "Form teams and connect with potential collaborators",
        status: 'current'
      },
      {
        phase: "Hacking Begins",
        date: "2024-05-15",
        startTime: "02:00 PM",
        endTime: "08:00 PM",
        description: "Start working on your projects with your team",
        status: 'upcoming'
      }
    ];
    setTimelineEvents(mockTimelineData);
  }, []);

  const triggerConfetti = () => {
    if (confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  useEffect(() => {
    // Trigger confetti when component mounts
    triggerConfetti();
  }, [confetti]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900 rounded-xl p-8 shadow-xl mb-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8">
            Team Registration Confirmed! 🎉
          </h1>
          
          <div className="text-center mb-8">
            <p className="text-xl text-zinc-300 mb-4">
              Congratulations! Your team has been successfully registered for the hackathon.
            </p>
            <p className="text-zinc-400">
              You are team #{registeredTeams} to register for this event.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  Join the Discord server for important announcements
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  Complete your team profile
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  Review the hackathon guidelines
                </li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                href={`/participant/hackathon/${params.id}/dashboard`}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={triggerConfetti}
                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
              >
                Celebrate Again! 🎉
              </button>
            </div>
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900 rounded-xl p-8 border border-zinc-800"
        >
          <h2 className="text-2xl font-bold mb-8">Event Schedule</h2>
          <div className="relative">
            {/* Container for horizontal scroll */}
            <div 
              ref={scrollRef}
              className="overflow-x-auto overflow-y-hidden pb-8"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              <div className="relative min-w-max pb-12 pt-8">
                {/* Glowing Path */}
                <svg
                  className="absolute top-[60px] left-0"
                  width={timelineEvents.length * 300}
                  height="100"
                  viewBox={`0 0 ${timelineEvents.length * 300} 100`}
                  fill="none"
                  preserveAspectRatio="none"
                >
                  {/* Background path */}
                  <path
                    d={`M0 50 ${timelineEvents.map((_, index) => {
                      const x = index * 300;
                      const controlPoint1X = x + 75;
                      const controlPoint2X = x + 225;
                      const nextX = x + 300;
                      return index % 2 === 0
                        ? `C ${controlPoint1X} 20, ${controlPoint2X} 20, ${nextX} 50`
                        : `C ${controlPoint1X} 80, ${controlPoint2X} 80, ${nextX} 50`;
                    }).join(' ')}`}
                    stroke="#27272a"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Glowing animated path */}
                  <motion.path
                    d={`M0 50 ${timelineEvents.map((_, index) => {
                      const x = index * 300;
                      const controlPoint1X = x + 75;
                      const controlPoint2X = x + 225;
                      const nextX = x + 300;
                      return index % 2 === 0
                        ? `C ${controlPoint1X} 20, ${controlPoint2X} 20, ${nextX} 50`
                        : `C ${controlPoint1X} 80, ${controlPoint2X} 80, ${nextX} 50`;
                    }).join(' ')}`}
                    stroke="url(#blue-glow)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{
                      pathLength: pathLength,
                      strokeDasharray: 1,
                      strokeDashoffset: 1,
                    }}
                  />
                  {/* Enhanced gradient definition */}
                  <defs>
                    <linearGradient id="blue-glow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                </svg>

                {/* Timeline Events */}
                <div className="flex gap-16 px-8">
                  {timelineEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative w-[250px]"
                      style={{
                        marginTop: index % 2 === 0 ? '0px' : '100px'
                      }}
                    >
                      {/* Timeline Node */}
                      <div className="absolute left-1/2 -translate-x-1/2">
                        <motion.div 
                          className={`w-[50px] h-[50px] rounded-full flex items-center justify-center
                            ${event.status === 'current' 
                              ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                              : 'bg-zinc-800 border-2 border-zinc-700'}`}
                          whileHover={{ scale: 1.1 }}
                          style={{ filter: event.status === 'current' ? 'drop-shadow(0 0 10px #3b82f6)' : 'none' }}
                        >
                          <motion.div 
                            className={`w-[30px] h-[30px] rounded-full flex items-center justify-center
                              ${event.status === 'current' 
                                ? 'bg-white' 
                                : 'bg-zinc-600'}`}
                          >
                            <span className="text-xs font-bold">
                              {index + 1}
                            </span>
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className={`pt-24 ${index % 2 === 0 ? 'block' : 'block'}`}>
                        <motion.div
                          className="bg-zinc-800/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-700/50
                            hover:border-blue-500/50 transition-colors"
                          whileHover={{ 
                            y: -5,
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                          }}
                        >
                          <div className={`font-bold text-xl mb-2 ${
                            event.status === 'current' ? 'text-blue-400' : 'text-zinc-300'
                          }`}>
                            {event.phase}
                          </div>
                          <div className="text-zinc-400 text-sm mb-2">
                            {new Date(event.date).toLocaleDateString()}
                            <span className="mx-2">•</span>
                            {event.startTime} - {event.endTime}
                          </div>
                          <p className="text-zinc-500 text-sm">{event.description}</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamConfirmation; 