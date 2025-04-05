'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

// Add this CSS class at the top of your file
const scrollbarHideStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const HackathonDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const scrollRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const pathLength = useSpring(scrollXProgress, { stiffness: 400, damping: 90 });

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        // Get hackathonId from pathname
        const hackathonId = pathname.split('/').pop();

        console.log(hackathonId)
        
        const response = await axios.get(`http://localhost:7000/api/organizers/hackathons/${hackathonId}`);
        if (response.data) {
          const hackathonData = response.data.hackathon;
          setHackathon({
            id: hackathonData._id,
            name: hackathonData.name,
            description: hackathonData.description,
            theme: hackathonData.theme,
            rules: hackathonData.rules,
    prizes: {
              first: `₹${hackathonData.prizeDistribution[0].amount}`,
              second: `₹${hackathonData.prizeDistribution[1].amount}`,
              third: `₹${hackathonData.prizeDistribution[2].amount}`
            },
            registrationFee: `₹${hackathonData.registrationFee} per team`,
            teamSize: `${hackathonData.minTeamSize}-${hackathonData.maxTeamSize} members`,
            date: new Date(hackathonData.startDate).toISOString(),
            time: hackathonData.time.startTime,
            venue: hackathonData.location.type,
            applicationDeadline: new Date(hackathonData.registrationEndDate).toISOString(),
            schedule: [
              {
                phase: 'Registration Opens',
                date: new Date(hackathonData.registrationStartDate).toISOString(),
                time: hackathonData.time.startTime,
                status: new Date() < new Date(hackathonData.registrationStartDate) ? 'upcoming' : 'completed',
                description: 'Team registration period begins'
              },
              {
                phase: 'Registration Deadline',
                date: new Date(hackathonData.registrationEndDate).toISOString(),
                time: hackathonData.time.endTime,
                status: new Date() < new Date(hackathonData.registrationEndDate) ? 'upcoming' : 'completed',
                description: 'Last date to register your team'
              },
              {
                phase: 'Hackathon Begins',
                date: new Date(hackathonData.startDate).toISOString(),
                time: hackathonData.time.startTime,
                status: new Date() < new Date(hackathonData.startDate) ? 'upcoming' : 'completed',
                description: `${hackathonData.duration} hackathon begins`
              },
              {
                phase: 'Hackathon Ends',
                date: new Date(hackathonData.endDate).toISOString(),
                time: hackathonData.time.endTime,
                status: new Date() < new Date(hackathonData.endDate) ? 'upcoming' : 'completed',
                description: 'Project submissions and presentations'
              }
            ],
            faqs: [
              {
                question: 'What is the team size requirement?',
                answer: `Teams must have between ${hackathonData.minTeamSize} and ${hackathonData.maxTeamSize} members.`
              },
              {
                question: 'What are the judging criteria?',
                answer: hackathonData.judgingCriteria.map(criteria => 
                  `${criteria.criterion} (${criteria.weightage}%)`
                ).join(', ')
              },
              {
                question: 'What domains are covered?',
                answer: `This hackathon covers the following domains: ${hackathonData.domains.join(', ')}`
              },
              {
                question: 'What is the prize distribution?',
                answer: `Total prize pool of ₹${hackathonData.prizePool}. ${hackathonData.prizeDistribution.map(prize => 
                  `${prize.position}: ₹${prize.amount}`
                ).join(', ')}`
              }
            ],
            status: hackathonData.status,
            participants: hackathonData.participants || 0,
            duration: hackathonData.duration,
            domains: hackathonData.domains,
            judgingCriteria: hackathonData.judgingCriteria,
            startDate: new Date(hackathonData.startDate),
            endDate: new Date(hackathonData.endDate),
            registrationStartDate: new Date(hackathonData.registrationStartDate),
            registrationEndDate: new Date(hackathonData.registrationEndDate)
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hackathon details:', error);
        setLoading(false);
      }
    };

    fetchHackathonDetails();
  }, [pathname]);


  useEffect(() => {
    if (hackathon) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const registrationEnd = new Date(hackathon.registrationEndDate).getTime();
        const distance = registrationEnd - now;

        if (distance < 0) {
          clearInterval(timer);
          setCountdown({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
        } else {
          setCountdown({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [hackathon]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading hackathon details...</p>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Hackathon not found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate time remaining
  const deadline = new Date(hackathon.applicationDeadline);
  const now = new Date();
  const timeRemaining = deadline - now;
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 ${
        activeTab === tab
          ? 'bg-white text-black'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
      }`}
    >
      {label}
    </button>
  );

  const renderScheduleContent = () => (
    <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
      <h2 className="text-2xl font-bold mb-8">Event Schedule</h2>
      <div className="relative">
        {/* Container for horizontal scroll */}
        <div 
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden pb-8 hide-scrollbar"
        >
          <div className="relative min-w-max pb-12 pt-8">
            {/* Glowing Path */}
            <svg
              className="absolute top-[60px] left-0"
              width={hackathon.schedule.length * 300}
              height="100"
              viewBox={`0 0 ${hackathon.schedule.length * 300} 100`}
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Background path */}
              <path
                d={`M0 50 
                  ${hackathon.schedule.map((_, index) => {
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
                d={`M0 50 
                  ${hackathon.schedule.map((_, index) => {
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
              {hackathon.schedule.map((event, index) => (
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
                        {new Date(event.date).toLocaleDateString()} at {event.time}
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
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Add the style tag for scrollbar hiding */}
      <style>{scrollbarHideStyles}</style>
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Header Box */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">{hackathon.name}</h1>
          <p className="text-lg text-zinc-400 mb-8">{hackathon.description}</p>
          
          {/* Tab Navigation */}
          <div className="flex space-x-4">
            <TabButton tab="overview" label="Overview" />
            <TabButton tab="schedule" label="Schedule" />
          </div>
        </motion.div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Fixed */}
            <div>
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 sticky top-8">
                <div className="space-y-6">
                  {/* Timeline Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Event Timeline</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-zinc-400">Event Duration</p>
                        <p className="font-medium">{hackathon.duration}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Event Dates</p>
                        <p className="font-medium">
                          {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Location</p>
                        <p className="font-medium capitalize">{hackathon.venue}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Registration Closes In</p>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          <div className="bg-zinc-800 p-2 rounded-lg text-center">
                            <div className="text-xl font-bold">{countdown.days}</div>
                            <div className="text-xs text-zinc-400">Days</div>
                          </div>
                          <div className="bg-zinc-800 p-2 rounded-lg text-center">
                            <div className="text-xl font-bold">{countdown.hours}</div>
                            <div className="text-xs text-zinc-400">Hours</div>
                          </div>
                          <div className="bg-zinc-800 p-2 rounded-lg text-center">
                            <div className="text-xl font-bold">{countdown.minutes}</div>
                            <div className="text-xs text-zinc-400">Minutes</div>
                          </div>
                          <div className="bg-zinc-800 p-2 rounded-lg text-center">
                            <div className="text-xl font-bold">{countdown.seconds}</div>
                            <div className="text-xs text-zinc-400">Seconds</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button with Popup */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowApplyPopup(true)}
                      className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                    >
                      Apply Now
                    </motion.button>

                    <AnimatePresence>
                      {showApplyPopup && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setShowApplyPopup(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden z-50"
                          >
                            <motion.button
                              whileHover={{ backgroundColor: '#3b82f6' }}
                              onClick={() => router.push(`/participant/hackathon/${pathname.split('/').pop()}/create-team`)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-600 transition-colors flex items-center space-x-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>Apply as Leader</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ backgroundColor: '#3b82f6' }}
                              onClick={() => router.push(`/participant/hackathon/${pathname.split('/').pop()}/join-team`)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-600 transition-colors flex items-center space-x-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>Join a Team</span>
                            </motion.button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Back Button */}
                  <button
                    onClick={() => router.back()}
                    className="w-full py-3 bg-transparent border border-zinc-700 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section - Scrollable */}
            <div>
              <div 
                className="space-y-8 pr-4 overflow-y-auto hide-scrollbar" 
                style={{ height: 'calc(100vh - 20rem)' }}
              >
                {/* Theme */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-xl font-semibold mb-3">Theme</h2>
                  <p className="text-zinc-400">{hackathon.theme}</p>
                </div>

                {/* Rules */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-xl font-semibold mb-3">Rules</h2>
                  <ul className="list-disc list-inside space-y-2 text-zinc-400">
                    {hackathon.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>

                {/* Info Boxes */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <h3 className="text-xl font-semibold mb-4">Winning Amount</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-zinc-800 rounded-lg">
                        <div className="text-2xl font-bold text-white mb-1">{hackathon.prizes.first}</div>
                        <div className="text-sm text-zinc-400">1st Prize</div>
                      </div>
                      <div className="text-center p-4 bg-zinc-800 rounded-lg">
                        <div className="text-2xl font-bold text-white mb-1">{hackathon.prizes.second}</div>
                        <div className="text-sm text-zinc-400">2nd Prize</div>
                      </div>
                      <div className="text-center p-4 bg-zinc-800 rounded-lg">
                        <div className="text-2xl font-bold text-white mb-1">{hackathon.prizes.third}</div>
                        <div className="text-sm text-zinc-400">3rd Prize</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                      <h3 className="text-xl font-semibold mb-2">Registration Fee</h3>
                      <p className="text-2xl font-bold">{hackathon.registrationFee}</p>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                      <h3 className="text-xl font-semibold mb-2">Team Size</h3>
                      <p className="text-2xl font-bold">{hackathon.teamSize}</p>
                    </div>
                  </div>
                </div>

                {/* FAQs */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-xl font-semibold mb-4">FAQs</h2>
                  <div className="space-y-4">
                    {hackathon.faqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        className="bg-zinc-800 rounded-lg overflow-hidden"
                        initial={false}
                      >
                        <button
                          className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-zinc-700 transition-colors"
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        >
                          <span className="font-medium">{faq.question}</span>
                          <svg
                            className={`w-5 h-5 transform transition-transform ${
                              expandedFaq === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <motion.div
                          initial={false}
                          animate={{
                            height: expandedFaq === index ? 'auto' : 0,
                            opacity: expandedFaq === index ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 py-3 text-zinc-400 bg-zinc-800/50">{faq.answer}</p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : renderScheduleContent()}
      </div>
    </div>
  );
};

export default HackathonDetails; 