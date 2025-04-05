'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';

const HackathonDetails = ({ params }) => {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const scrollRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const pathLength = useSpring(scrollXProgress, { stiffness: 400, damping: 90 });

  // Sample data - replace with API call using params.id
  const hackathon = {
    id: params.id,
    name: 'AI Innovation Hackathon',
    description: 'Join us for an exciting hackathon focused on artificial intelligence and machine learning innovations. Build cutting-edge solutions that leverage AI to solve real-world problems.',
    theme: 'Artificial Intelligence for Social Good',
    rules: [
      'Teams must consist of 2-4 members',
      'All code must be original and created during the hackathon',
      'Use of open-source libraries is allowed',
      'Projects must be submitted before the deadline',
      'Each team will have 5 minutes for presentation'
    ],
    prizes: {
      first: '₹50,000',
      second: '₹30,000',
      third: '₹20,000'
    },
    registrationFee: '₹500 per team',
    teamSize: '2-4 members',
    date: '2024-05-15',
    time: '9:00 AM IST',
    venue: 'Virtual Event',
    applicationDeadline: '2024-05-01',
    faqs: [
      {
        question: 'What should I bring to the hackathon?',
        answer: 'For virtual participation, you need a computer with stable internet connection, required software tools, and your creativity!'
      },
      {
        question: 'Is there a specific theme I need to follow?',
        answer: 'Yes, all projects should align with the theme of AI for Social Good. Specific problem statements will be provided at the start.'
      },
      {
        question: 'How will the judging be conducted?',
        answer: 'Projects will be judged based on innovation, technical complexity, practical applicability, and presentation quality.'
      },
      {
        question: 'Are there any prerequisites?',
        answer: 'Basic programming knowledge and familiarity with AI/ML concepts is recommended but not mandatory.'
      }
    ],
    schedule: [
      {
        phase: 'Registration',
        date: '2024-04-15',
        time: '09:00 AM IST',
        status: 'current',
        description: 'Team registration opens'
      },
      {
        phase: 'Ideation',
        date: '2024-04-20',
        time: '10:00 AM IST',
        status: 'upcoming',
        description: 'Problem statement release and ideation phase begins'
      },
      {
        phase: 'Development Kickoff',
        date: '2024-05-15',
        time: '09:00 AM IST',
        status: 'upcoming',
        description: 'Hackathon begins with opening ceremony'
      },
      {
        phase: 'Mentorship Sessions',
        date: '2024-05-15',
        time: '02:00 PM IST',
        status: 'upcoming',
        description: 'One-on-one mentorship sessions with industry experts'
      },
      {
        phase: 'Mid-Review',
        date: '2024-05-16',
        time: '10:00 AM IST',
        status: 'upcoming',
        description: 'Progress check and feedback from mentors'
      },
      {
        phase: 'Final Submissions',
        date: '2024-05-17',
        time: '08:00 AM IST',
        status: 'upcoming',
        description: 'Project submission deadline'
      },
      {
        phase: 'Presentations',
        date: '2024-05-17',
        time: '02:00 PM IST',
        status: 'upcoming',
        description: 'Team presentations and demos'
      },
      {
        phase: 'Awards Ceremony',
        date: '2024-05-17',
        time: '06:00 PM IST',
        status: 'upcoming',
        description: 'Winners announcement and closing ceremony'
      }
    ]
  };

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
                        <p className="text-zinc-400">When</p>
                        <p className="font-medium">{new Date(hackathon.date).toLocaleDateString()} at {hackathon.time}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Where</p>
                        <p className="font-medium">{hackathon.venue}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400">Application Closes In</p>
                        <p className="font-medium">{daysRemaining} days</p>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                  >
                    Apply Now
                  </motion.button>

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
                className="space-y-8 pr-4" 
                style={{ 
                  height: 'calc(100vh - 20rem)',
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }}
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