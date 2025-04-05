'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const TeamConfirmation = ({ params }) => {
  const [registeredTeams, setRegisteredTeams] = useState(42); // Sample data
  const [confetti, setConfetti] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const scrollRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const pathLength = useSpring(scrollXProgress, { stiffness: 400, damping: 90 });

  useEffect(() => {
    // Dynamically import confetti only on client side
    import('canvas-confetti').then((confettiModule) => {
      setConfetti(() => confettiModule.default);
    });

    // TODO: Replace with actual API call to fetch timeline data
    // This should fetch the same timeline data that organizer configured
    const fetchTimelineData = async () => {
      try {
        // Mock API call - replace with actual API endpoint
        const response = await fetch(`/api/hackathon/${params.id}/timeline`);
        const data = await response.json();
        setTimelineEvents(data.timeline);
      } catch (error) {
        // Fallback to mock data if API fails
        const mockTimelineData = [
          {
            phase: "Orientation & Kickoff",
            date: "2024-05-15",
            startTime: "09:00 AM",
            endTime: "10:00 AM",
            description: "Welcome session, rules explanation, and team introductions",
            status: 'upcoming',
            duration: 1
          },
          {
            phase: "Team Formation & Networking",
            date: "2024-05-15",
            startTime: "10:00 AM",
            endTime: "11:30 AM",
            description: "Form teams and connect with potential collaborators",
            status: 'current',
            duration: 1.5
          },
          {
            phase: "Hacking Begins",
            date: "2024-05-15",
            startTime: "02:00 PM",
            endTime: "08:00 PM",
            description: "Start working on your projects with your team",
            status: 'upcoming',
            duration: 6
          }
        ];
        setTimelineEvents(mockTimelineData);
      }
    };

    fetchTimelineData();
  }, [params.id]);

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

  const handleCheckpointClick = (event) => {
    if (event.checkpointType === 'documents') {
      setSelectedCheckpoint(event);
      setShowDocumentModal(true);
    }
  };

  const handleDocumentSubmission = async (files) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      for (const file of files) {
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} has an invalid type. Only PDF, DOC, and DOCX files are allowed.`);
        }

        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 0
        }));

        // TODO: Implement actual file upload logic here
        // For now, just simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: i
          }));
        }

        // Add uploaded document to the list
        setDocuments(prev => [...prev, {
          id: Date.now(),
          name: file.name,
          status: 'pending',
          url: URL.createObjectURL(file)
        }]);
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
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
                              hover:border-blue-500/50 transition-colors cursor-pointer"
                            whileHover={{ 
                              y: -5,
                              boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                            }}
                            onClick={() => handleCheckpointClick(event)}
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
                              <span className="ml-2 text-zinc-500">({event.duration}h)</span>
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

      {/* Document Upload Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Document Submission</h2>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="document-upload"
                  onChange={(e) => handleDocumentSubmission(Array.from(e.target.files))}
                  disabled={isUploading}
                />
                <label
                  htmlFor="document-upload"
                  className={`cursor-pointer block ${isUploading ? 'opacity-50' : ''}`}
                >
                  <div className="text-zinc-400">
                    <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm">
                      {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
                    </p>
                    <p className="text-xs mt-1">Supported formats: PDF, DOC, DOCX</p>
                  </div>
                </label>
              </div>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <div key={fileName} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-zinc-400">{fileName}</span>
                        <span className="text-zinc-400">{progress}%</span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {uploadError && (
                <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded-lg">
                  {uploadError}
                </div>
              )}

              {documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-zinc-400">Uploaded Documents</h4>
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between bg-zinc-800 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm truncate">{doc.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          doc.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          doc.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamConfirmation; 