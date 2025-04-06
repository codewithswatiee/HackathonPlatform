'use client';

import { selectCurrentUser } from '@/redux/features/authSlice';
import axios from 'axios';
import { motion, useAnimationFrame } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const ParticipantDashboard = () => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser)
  console.log(user)
  const [hackathons, setHackathons] = useState([]);

  // Add useEffect for fetching hackathons
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/organizers/hackathons');
        if (response.data) {
          // Transform the data to match our frontend structure
          const transformedHackathons = response.data?.hackathons.map(hackathon => ({
            id: hackathon._id,
            title: hackathon.name,
            date: new Date(hackathon.startDate).toISOString().split('T')[0],
            location: hackathon.location.type,
            description: hackathon.description,
            status: hackathon.status,
            points: hackathon.prizePool,
            participants: 0,
            difficulty: hackathon.domains.length > 3 ? 'Advanced' : hackathon.domains.length > 1 ? 'Intermediate' : 'Beginner',
            theme: hackathon.theme,
            startDate: new Date(hackathon.startDate),
            endDate: new Date(hackathon.endDate),
            registrationStartDate: new Date(hackathon.registrationStartDate),
            registrationEndDate: new Date(hackathon.registrationEndDate),
            duration: hackathon.duration,
            time: hackathon.time,
            registrationFee: hackathon.registrationFee,
            prizeDistribution: hackathon.prizeDistribution,
            domains: hackathon.domains,
            maxTeamSize: hackathon.maxTeamSize,
            minTeamSize: hackathon.minTeamSize,
            rules: hackathon.rules,
            judgingCriteria: hackathon.judgingCriteria
          }));
          setHackathons(transformedHackathons);
        }
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      }
    };

    fetchHackathons();
  }, []);


  console.log(hackathons)

  const [userStats, setUserStats] = useState({
    level: 3,
    experience: 750,
    nextLevel: 1000,
    completedHackathons: 2,
    badges: ['First Hackathon', 'Quick Learner', 'Team Player'],
    streak: 5,
  });

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'registered', 'completed'
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Sample data for charts
  const skillData = [
    { name: 'Frontend', value: 75 },
    { name: 'Backend', value: 60 },
    { name: 'UI/UX', value: 85 },
    { name: 'DevOps', value: 40 },
    { name: 'AI/ML', value: 55 },
  ];

  const progressData = [
    { month: 'Jan', completed: 0, upcoming: 1 },
    { month: 'Feb', completed: 1, upcoming: 0 },
    { month: 'Mar', completed: 0, upcoming: 2 },
    { month: 'Apr', completed: 1, upcoming: 1 },
    { month: 'May', completed: 0, upcoming: 2 },
    { month: 'Jun', completed: 0, upcoming: 1 },
  ];

  const COLORS = ['#4ADE80', '#F472B6', '#60A5FA', '#FBBF24', '#A78BFA'];

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

  const profileVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Hackathon Available',
      message: 'AI Innovation Hackathon is now open for registration',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Upcoming Deadline',
      message: 'Web3 Development Challenge registration closes in 2 days',
      time: '1 day ago',
      unread: false
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const [internships, setInternships] = useState([
    {
      id: 1,
      company: 'TechCorp',
      position: 'Software Development Intern',
      location: 'Remote',
      type: 'Full-time',
      skills: ['React', 'Node.js', 'TypeScript']
    },
    {
      id: 2,
      company: 'AI Solutions',
      position: 'Machine Learning Intern',
      location: 'New York, USA',
      type: 'Part-time',
      skills: ['Python', 'TensorFlow', 'Data Science']
    },
    {
      id: 3,
      company: 'BlockChain Inc',
      position: 'Blockchain Development Intern',
      location: 'Hybrid',
      type: 'Full-time',
      skills: ['Solidity', 'Web3.js', 'Smart Contracts']
    }
  ]);

  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // Duplicate internships for continuous scroll
  const duplicatedInternships = [...internships, ...internships];

  useAnimationFrame(() => {
    if (shouldAutoScroll && scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      setScrollY(prev => {
        const newScrollY = prev + 0.5; // Adjust speed by changing this value
        // Reset scroll position when reaching the end
        if (newScrollY >= scrollHeight / 2) {
          return 0;
        }
        return newScrollY;
      });
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-12 px-4 sm:px-6 lg:px-8 font-['Lilita_One']">
      {/* Google Fonts Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Hackathon Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-zinc-800 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors relative"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-orange-500 transform translate-x-1 -translate-y-1"></span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-80 bg-zinc-900 rounded-xl shadow-lg border border-zinc-800 z-50"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                    <div className="space-y-4">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-3 rounded-lg ${notification.unread ? 'bg-zinc-800' : 'bg-zinc-900'} border border-zinc-700`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{notification.title}</h4>
                            <span className="text-xs text-zinc-400">{notification.time}</span>
                          </div>
                          <p className="text-sm text-zinc-400 mt-1">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Profile Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(true)}
              className="px-4 py-2 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </motion.button>
          </div>
        </div>

        {/* User Stats Section with Internship Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-zinc-800 rounded-xl p-6 shadow-lg border border-zinc-700"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative w-20 h-20 mr-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 animate-pulse"></div>
                  <div className="absolute inset-1 rounded-full bg-zinc-900 flex items-center justify-center">
                    <span className="text-2xl font-bold">JD</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">John Doe</h2>
                  <p className="text-zinc-400">Hackathon Enthusiast</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfile(true)}
                className="px-4 py-2 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </motion.button>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <span className="text-zinc-400">Level {userStats.level}</span>
                <span className="text-zinc-400">{userStats.experience}/{userStats.nextLevel} XP</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                  style={{ width: `${(userStats.experience / userStats.nextLevel) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-zinc-700 rounded-lg p-4 flex-1 min-w-[120px] text-center border border-zinc-600">
                <div className="text-2xl font-bold">{userStats.completedHackathons}</div>
                <div className="text-sm text-zinc-400">Completed</div>
              </div>
              <div className="bg-zinc-700 rounded-lg p-4 flex-1 min-w-[120px] text-center border border-zinc-600">
                <div className="text-2xl font-bold">{userStats.streak}</div>
                <div className="text-sm text-zinc-400">Day Streak</div>
              </div>
              <div className="bg-zinc-700 rounded-lg p-4 flex-1 min-w-[120px] text-center border border-zinc-600">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-zinc-400">Upcoming</div>
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
                    className="px-3 py-1 bg-zinc-700 rounded-full text-xs border border-zinc-600"
                  >
                    {badge}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Internship Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-800 rounded-xl p-6 shadow-lg border border-zinc-700"
          >
            <h2 className="text-xl font-bold tracking-tight mb-4">Related Internships</h2>
            <motion.div
              ref={scrollRef}
              onMouseEnter={() => setShouldAutoScroll(false)}
              onMouseLeave={() => setShouldAutoScroll(true)}
              className="space-y-4 max-h-[400px] overflow-y-auto scroll-smooth"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
              }}
            >
              {duplicatedInternships.map((internship, index) => (
                <motion.div
                  key={`${internship.id}-${index}`}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="p-4 bg-zinc-700 rounded-lg border border-zinc-600"
                  style={{
                    opacity: 1,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{internship.position}</h3>
                    <span className="text-xs px-2 py-1 bg-zinc-600 rounded-full">
                      {internship.type}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">{internship.company}</p>
                  <div className="flex items-center text-sm text-zinc-400 mt-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {internship.location}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {internship.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="text-xs px-2 py-1 bg-zinc-600 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-3 w-full px-3 py-1.5 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
                  >
                    Apply Now
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Profile Modal */}
        {showProfile && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={profileVariants}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              className="bg-zinc-900 rounded-xl p-6 max-w-4xl w-full border border-zinc-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Profile</h2>
                <div className="flex space-x-2">
                  {isEditingProfile ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                      Edit Profile
                    </motion.button>
                  )}
                  <button 
                    onClick={() => setShowProfile(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Profile Info */}
                <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                      <span className="text-xl font-bold">JD</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">John Doe</h3>
                      <p className="text-zinc-400">Hackathon Enthusiast</p>
                    </div>
                  </div>
                  {isEditingProfile ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          defaultValue="John Doe"
                          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                        <input 
                          type="email" 
                          defaultValue="john.doe@example.com"
                          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white cursor-not-allowed opacity-75"
                          disabled
                        />
                        <p className="text-xs text-zinc-500 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Location</label>
                        <input 
                          type="text" 
                          defaultValue="New York, USA"
                          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Bio</label>
                        <textarea 
                          defaultValue="Hackathon Enthusiast"
                          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
                          rows="2"
                        ></textarea>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
                      >
                        Save Changes
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Email:</span>
                        <span>john.doe@example.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Location:</span>
                        <span>New York, USA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Joined:</span>
                        <span>January 2024</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills Chart */}
                <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <h3 className="text-lg font-semibold mb-4">Skills Progress</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={skillData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {skillData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {skillData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-xs">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Level {userStats.level}</span>
                        <span>{userStats.experience}/{userStats.nextLevel} XP</span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${(userStats.experience / userStats.nextLevel) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{userStats.completedHackathons}</div>
                        <div className="text-xs text-zinc-400">Completed</div>
                      </div>
                      <div className="bg-zinc-700 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{userStats.streak}</div>
                        <div className="text-xs text-zinc-400">Day Streak</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {userStats.badges.map((badge, index) => (
                          <span key={index} className="px-2 py-1 bg-zinc-700 rounded-full text-xs">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Tabs for Hackathon Categories */}
        <div className="flex space-x-2 mb-6 border-b border-zinc-700">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'upcoming' 
                ? 'text-white border-b-2 border-orange-500' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Upcoming Hackathons
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'registered' 
                ? 'text-white border-b-2 border-orange-500' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Registered Hackathons
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'completed' 
                ? 'text-white border-b-2 border-orange-500' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Completed Hackathons
          </button>
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
              className="bg-zinc-800 overflow-hidden rounded-lg border border-zinc-700 hover:border-orange-500 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold tracking-tight">{hackathon.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    hackathon.status === 'upcoming' ? 'bg-yellow-900/30 text-yellow-300' :
                    hackathon.status === 'active' ? 'bg-green-900/30 text-green-300' :
                    'bg-red-900/30 text-red-300'
                  }`}>
                    {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-zinc-400">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(hackathon.startDate).toLocaleDateString()}
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
                  <div className="bg-zinc-700 rounded-md p-2">
                    <div className="text-lg font-bold">₹{hackathon.registrationFee}</div>
                    <div className="text-xs text-zinc-400">Entry Fee</div>
                  </div>
                  <div className="bg-zinc-700 rounded-md p-2">
                    <div className="text-lg font-bold">₹{hackathon.points}</div>
                    <div className="text-xs text-zinc-400">Prize Pool</div>
                  </div>
                  <div className="bg-zinc-700 rounded-md p-2">
                    <div className="text-lg font-bold">{hackathon.duration}</div>
                    <div className="text-xs text-zinc-400">Duration</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm text-zinc-400 mb-2">Domains:</div>
                  <div className="flex flex-wrap gap-2">
                    {hackathon.domains.map((domain, index) => (
                      <span key={index} className="px-2 py-1 bg-zinc-700 rounded-full text-xs">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/participant/hackathon/${hackathon.id}`)}
                  className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-black bg-white hover:bg-zinc-200 focus:outline-none"
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