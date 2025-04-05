"use client"

import { getProblemStatements, getUserDocuments, saveDocumentMetadata, saveProblemStatement, uploadFile } from '@/firebase/utils'
import { ArrowLeftIcon, CalendarIcon, TagIcon, UserGroupIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { motion, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

function calculateTimeRemaining(targetDate) {
  const now = new Date()
  const target = new Date(targetDate)
  const difference = target - now

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0 }
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes }
}

export default function HackathonAnalytics({ params }) {
  const [hackathon, setHackathon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeToRegistration, setTimeToRegistration] = useState({ days: 0, hours: 0, minutes: 0 })
  const [timeToStart, setTimeToStart] = useState({ days: 0, hours: 0, minutes: 0 })
  const [showOrganizerModal, setShowOrganizerModal] = useState(false)
  const [activeTab, setActiveTab] = useState('analytics')
  const [showTimelineConfig, setShowTimelineConfig] = useState(false)
  const [timelineEvents, setTimelineEvents] = useState([])
  const [timelineConfigured, setTimelineConfigured] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const scrollRef = useRef(null)
  const { scrollXProgress } = useScroll({ container: scrollRef })
  const pathLength = useSpring(scrollXProgress, { stiffness: 400, damping: 90 })
  const [problemStatements, setProblemStatements] = useState({})
  const [documents, setDocuments] = useState([])
  const [showProblemStatementModal, setShowProblemStatementModal] = useState(false)
  const [showAIIdeationModal, setShowAIIdeationModal] = useState(false)
  const [selectedProblemStatement, setSelectedProblemStatement] = useState(null)
  const [uploadProgress, setUploadProgress] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [currentCheckpoint, setCurrentCheckpoint] = useState(null)

  const domainChartData = {
    labels: Object.keys(hackathon?.registeredTeams?.byDomain || {}),
    datasets: [
      {
        data: Object.values(hackathon?.registeredTeams?.byDomain || {}),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(16, 185, 129, 0.8)', // green
          'rgba(239, 68, 68, 0.8)',  // red
          'rgba(245, 158, 11, 0.8)', // yellow
          'rgba(139, 92, 246, 0.8)', // purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    // In a real app, fetch data from API
    // For now, using mock data
    const mockData = {
      name: "Tech Innovation 2024",
      description: "A 48-hour hackathon focused on building innovative solutions using emerging technologies",
      topic: "AI and Sustainable Technology",
      organizer: {
        name: "John Doe",
        organization: "Tech Innovators Inc.",
        email: "john@techinnovators.com",
        phone: "+1 (555) 123-4567"
      },
      registrationDeadline: "2024-04-30T23:59:59",
      startDate: "2024-05-15T09:00:00",
      endDate: "2024-05-17T18:00:00",
      maxTeams: 150,
      registeredTeams: {
        total: 85,
        byDomain: {
          'Web Dev': 30,
          'AI/ML': 25,
          'Blockchain': 15,
          'Mobile': 15
        }
      },
      teams: [
        {
          name: 'Team Alpha',
          domain: 'Web Dev',
          members: 4,
          score: 92,
          projectTitle: 'AI-Powered Code Review'
        },
        {
          name: 'Neural Ninjas',
          domain: 'AI/ML',
          members: 3,
          score: 88,
          projectTitle: 'Smart Healthcare Assistant'
        },
        {
          name: 'Block Chain Gang',
          domain: 'Blockchain',
          members: 4,
          score: 85,
          projectTitle: 'Decentralized Voting System'
        }
      ],
      schedule: [
        {
          phase: "Orientation / Kick-off",
          date: "2024-05-15",
          time: "09:00 AM",
          description: "Welcome session, rules explanation, and team introductions",
          status: 'upcoming'
        },
        {
          phase: "Idea Submission",
          date: "2024-05-15",
          time: "12:00 PM",
          description: "Submit your project idea and get initial feedback",
          status: 'upcoming'
        },
        {
          phase: "Hacking Starts",
          date: "2024-05-15",
          time: "01:00 PM",
          description: "Start working on your projects",
          status: 'current'
        },
        {
          phase: "Mentoring Sessions",
          date: "2024-05-16",
          time: "09:00 AM",
          description: "One-on-one sessions with industry mentors",
          status: 'upcoming'
        },
        {
          phase: "Checkpoint Submissions",
          date: "2024-05-16",
          time: "09:00 PM",
          description: "Submit your progress report and get feedback",
          status: 'upcoming'
        },
        {
          phase: "Final Project Submission",
          date: "2024-05-17",
          time: "02:00 PM",
          description: "Submit your final project with documentation",
          status: 'upcoming'
        },
        {
          phase: "Judging Rounds",
          date: "2024-05-17",
          time: "04:00 PM",
          description: "Present your project to the judges",
          status: 'upcoming'
        }
      ]
    }

    setHackathon(mockData)
    setLoading(false)

    // Update countdown timers every minute
    const timer = setInterval(() => {
      setTimeToRegistration(calculateTimeRemaining(mockData.registrationDeadline))
      setTimeToStart(calculateTimeRemaining(mockData.startDate))
    }, 60000)

    // Initial calculation
    setTimeToRegistration(calculateTimeRemaining(mockData.registrationDeadline))
    setTimeToStart(calculateTimeRemaining(mockData.startDate))

    return () => clearInterval(timer)
  }, [params.id])

  // Fetch user's documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // In a real app, you would get these IDs from your auth system
        const docs = await getUserDocuments(params.id, 'current-user-id');
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    const fetchProblemStatements = async () => {
      try {
        const statements = await getProblemStatements(params.id);
        const groupedStatements = statements.reduce((acc, statement) => {
          if (!acc[statement.domain]) {
            acc[statement.domain] = [];
          }
          acc[statement.domain].push(statement);
          return acc;
        }, {});
        setProblemStatements(groupedStatements);
      } catch (error) {
        console.error('Error fetching problem statements:', error);
      }
    };

    fetchDocuments();
    fetchProblemStatements();
  }, [params.id]);

  useEffect(() => {
    const updateCheckpointStatus = () => {
      const now = new Date();
      const updatedEvents = timelineEvents.map(event => {
        const eventStart = new Date(`${event.date} ${event.startTime}`);
        const eventEnd = new Date(`${event.date} ${event.endTime}`);
        
        if (now >= eventStart && now <= eventEnd) {
          setCurrentCheckpoint(event);
          return { ...event, status: 'current' };
        } else if (now < eventStart) {
          return { ...event, status: 'upcoming' };
        } else {
          return { ...event, status: 'completed' };
        }
      });
      
      setTimelineEvents(updatedEvents);
    };

    // Update status every minute
    const interval = setInterval(updateCheckpointStatus, 60000);
    
    // Initial update
    updateCheckpointStatus();
    
    return () => clearInterval(interval);
  }, [timelineEvents]);

  const handleTabChange = (tab) => {
    if (tab === 'timeline' && !timelineConfigured) {
      setShowTimelineConfig(true)
    }
    setActiveTab(tab)
  }

  const handleTimelineConfig = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const numEvents = parseInt(formData.get('numEvents'))
    const startDate = new Date(formData.get('startDate'))
    
    const newEvents = []
    for (let i = 0; i < numEvents; i++) {
      const eventName = formData.get(`event${i}Name`)
      const eventStartTime = formData.get(`event${i}StartTime`)
      const eventEndTime = formData.get(`event${i}EndTime`)
      const eventDescription = formData.get(`event${i}Description`)
      
      // Create event date with start time
      const [startHours, startMinutes] = eventStartTime.split(':')
      const [endHours, endMinutes] = eventEndTime.split(':')
      
      const eventStartDate = new Date(startDate)
      eventStartDate.setHours(parseInt(startHours), parseInt(startMinutes), 0)
      
      const eventEndDate = new Date(startDate)
      eventEndDate.setHours(parseInt(endHours), parseInt(endMinutes), 0)
      
      // Calculate duration in hours
      const durationMs = eventEndDate - eventStartDate
      const durationHours = Math.round((durationMs / (1000 * 60 * 60)) * 2) / 2 // Round to nearest 0.5
      
      newEvents.push({
        phase: eventName,
        date: eventStartDate.toISOString().split('T')[0],
        startTime: eventStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: eventEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: eventDescription,
        duration: durationHours,
        status: i === 0 ? 'current' : 'upcoming'
      })
    }
    
    // Sort events by start time
    newEvents.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.startTime}`)
      const dateB = new Date(`${b.date} ${b.startTime}`)
      return dateA - dateB
    })
    
    setTimelineEvents(newEvents)
    setTimelineConfigured(true)
    setShowTimelineConfig(false)
  }

  const generateAITimeline = () => {
    setIsGeneratingAI(true)
    
    // Calculate total duration in hours
    const startDate = new Date(hackathon.startDate)
    const endDate = new Date(hackathon.endDate)
    const totalHours = Math.floor((endDate - startDate) / (1000 * 60 * 60))
    
    // Mandatory checkpoints that will always be included
    const mandatoryCheckpoints = [
      {
        phase: "NOC & Document Submission",
        startTime: "09:00",
        endTime: "11:00",
        description: "Submit No Objection Certificate and required documents. Mandatory checkpoint for all participants.",
        duration: 2,
        isCheckpoint: true,
        checkpointType: "documents",
        status: 'current'
      },
      {
        phase: "Problem Statement Selection",
        startTime: "11:30",
        endTime: "13:30",
        description: "Select problem statement from available options based on your domain. Organizers can add new problem statements.",
        duration: 2,
        isCheckpoint: true,
        checkpointType: "problem_statement",
        status: 'upcoming'
      },
      {
        phase: "Ideation Phase",
        startTime: "14:00",
        endTime: "17:00",
        description: "Brainstorm and develop initial ideas for your selected problem statement. Use AI assistance for ideation.",
        duration: 3,
        isCheckpoint: true,
        checkpointType: "ideation",
        status: 'upcoming'
      }
    ]

    // Additional events based on hackathon duration
    const additionalEvents = []
    
    if (totalHours > 24) {
      additionalEvents.push(
        {
          phase: "Mentoring Sessions",
          startTime: "10:00",
          endTime: "12:00",
          description: "One-on-one sessions with industry mentors",
          duration: 2,
          dayOffset: 1,
          status: 'upcoming'
        },
        {
          phase: "Progress Check-in",
          startTime: "15:00",
          endTime: "16:00",
          description: "Teams present their progress and receive feedback",
          duration: 1,
          dayOffset: 1,
          status: 'upcoming'
        }
      )
    }

    if (totalHours > 36) {
      additionalEvents.push(
        {
          phase: "Final Submissions",
          startTime: "14:00",
          endTime: "16:00",
          description: "Submit your final project with documentation",
          duration: 2,
          dayOffset: 2,
          status: 'upcoming'
        },
        {
          phase: "Project Presentations",
          startTime: "16:00",
          endTime: "18:00",
          description: "Present your project to the judges",
          duration: 2,
          dayOffset: 2,
          status: 'upcoming'
        }
      )
    }

    // Convert events to timeline format
    const allEvents = [...mandatoryCheckpoints, ...additionalEvents].map((event, index) => {
      const eventDate = new Date(startDate)
      if (event.dayOffset) {
        eventDate.setDate(eventDate.getDate() + event.dayOffset)
      }
      
      return {
        ...event,
        date: eventDate.toISOString().split('T')[0],
        startTime: event.startTime,
        endTime: event.endTime
      }
    })

    setTimelineEvents(allEvents)
    setTimelineConfigured(true)
    setShowTimelineConfig(false)
    setIsGeneratingAI(false)
  }

  const handleEditEvent = (event, index) => {
    setEditingEvent({ ...event, index })
    setShowEditModal(true)
  }

  const handleUpdateEvent = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const eventName = formData.get('eventName')
    const eventStartTime = formData.get('eventStartTime')
    const eventEndTime = formData.get('eventEndTime')
    const eventDescription = formData.get('eventDescription')
    const eventDate = formData.get('eventDate')
    
    const updatedEvent = {
      ...editingEvent,
      phase: eventName,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      description: eventDescription,
      // Calculate new duration
      duration: Math.round(
        (new Date(`${eventDate} ${eventEndTime}`) - new Date(`${eventDate} ${eventStartTime}`)) 
        / (1000 * 60 * 60) * 2
      ) / 2
    }
    
    const updatedEvents = [...timelineEvents]
    updatedEvents[editingEvent.index] = updatedEvent
    
    // Sort events by date and time
    updatedEvents.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.startTime}`)
      const dateB = new Date(`${b.date} ${b.startTime}`)
      return dateA - dateB
    })
    
    setTimelineEvents(updatedEvents)
    setShowEditModal(false)
    setEditingEvent(null)
  }

  const handleDocumentSubmission = async (files) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      for (const file of files) {
        console.log('Processing file:', file.name);
        
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

        try {
          // Upload file to Firebase Storage with progress tracking
          const downloadURL = await uploadFile(
            file, 
            params.id, 
            'current-user-id',
            (progress) => {
              console.log(`Progress for ${file.name}:`, progress);
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: progress
              }));
            }
          );

          // Save metadata to Firestore
          await saveDocumentMetadata(params.id, 'current-user-id', {
            name: file.name,
            type: file.type,
            size: file.size,
            url: downloadURL,
            uploadedAt: new Date().toISOString()
          });

          console.log(`Successfully uploaded ${file.name}`);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadError(`Failed to upload ${file.name}: ${error.message}`);
          return; // Stop processing if one file fails
        }
      }

      // Refresh documents list
      const updatedDocs = await getUserDocuments(params.id, 'current-user-id');
      setDocuments(updatedDocs);
    } catch (error) {
      console.error('Error in document submission:', error);
      setUploadError(error.message || 'Failed to upload documents. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleProblemStatementUpload = async (e) => {
    e.preventDefault();
    const form = e.target;
    const domain = form.domain.value;
    const title = form.title.value;
    const description = form.description.value;

    try {
      const problemStatementId = await saveProblemStatement(params.id, {
        domain,
        title,
        description
      });

      // Refresh problem statements
      const statements = await getProblemStatements(params.id);
      const groupedStatements = statements.reduce((acc, statement) => {
        if (!acc[statement.domain]) {
          acc[statement.domain] = [];
        }
        acc[statement.domain].push(statement);
        return acc;
      }, {});
      setProblemStatements(groupedStatements);

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error saving problem statement:', error);
    }
  };

  const handleProblemStatementSelection = (statement) => {
    setSelectedProblemStatement(statement)
  }

  const handleAIIdeation = async (problemStatement) => {
    setShowAIIdeationModal(true)
    // AI ideation logic will be implemented here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/organizer/dashboard"
              className="flex items-center text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <button
              onClick={() => setShowOrganizerModal(true)}
              className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-200 transition-colors"
            >
              <UserGroupIcon className="w-5 h-5 mr-2" />
              View Organizer Profile
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-zinc-900 p-6 rounded-xl">
              <h3 className="text-3xl font-bold mb-4">{hackathon.name}</h3>
              <p className="text-zinc-400 mb-6 text-sm">{hackathon.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TagIcon className="w-5 h-5 text-blue-500" />
                    <h4 className="text-sm font-medium ml-2">Topic</h4>
                  </div>
                  <p className="text-blue-400 text-sm pl-7">{hackathon.topic}</p>
                </div>
                
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="w-5 h-5 text-green-500" />
                    <h4 className="text-sm font-medium ml-2">Date</h4>
                  </div>
                  <p className="text-zinc-300 text-sm pl-7">
                    {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Teams by Domain in Header */}
            <div className="bg-zinc-900 p-6 rounded-xl">
              <h3 className="text-xl mb-4">Teams by Domain</h3>
              <div className="relative h-[200px] flex items-center justify-center">
                <Pie
                  data={domainChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: 'white',
                          padding: 8,
                          usePointStyle: true,
                          pointStyle: 'circle',
                          boxWidth: 6,
                          font: {
                            size: 11
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} teams (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{hackathon.registeredTeams.total}</div>
                    <div className="text-xs text-zinc-400">Total Teams</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabChange('analytics')}
              className={`py-4 px-1 relative ${
                activeTab === 'analytics'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => handleTabChange('timeline')}
              className={`py-4 px-1 relative ${
                activeTab === 'timeline'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Teams Overview */}
              <div className="lg:col-span-3 bg-zinc-900 p-6 rounded-xl">
                <h3 className="text-xl mb-4">Registered Teams</h3>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="min-w-full">
                    <thead className="sticky top-0 bg-zinc-900 z-10">
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-4">Team Name</th>
                        <th className="text-left py-3 px-4">Domain</th>
                        <th className="text-left py-3 px-4">Members</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hackathon.teams.map((team, index) => (
                        <tr key={index} className="border-b border-zinc-800">
                          <td className="py-3 px-4">{team.name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full">
                              {team.domain}
                            </span>
                          </td>
                          <td className="py-3 px-4">{team.members}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Cards */}
              <div className="lg:col-span-2 space-y-6">
                {/* Team Registration Status - Moved to top */}
                <div className="bg-zinc-900 p-6 rounded-xl">
                  <h3 className="text-xl mb-4">Team Registrations</h3>
                  <div className="text-4xl font-bold text-green-500 mb-2">
                    {hackathon.registeredTeams.total}/{hackathon.maxTeams}
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(hackathon.registeredTeams.total / hackathon.maxTeams) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-sm text-zinc-400">
                    {hackathon.maxTeams - hackathon.registeredTeams.total} slots remaining
                  </div>
                </div>

                {/* Registration Deadline */}
                <div className="bg-zinc-900 p-6 rounded-xl">
                  <h3 className="text-xl mb-4">Registration Closes In</h3>
                  <div className="flex justify-around text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-500">{timeToRegistration.days}</div>
                      <div className="text-sm text-zinc-400">Days</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-500">{timeToRegistration.hours}</div>
                      <div className="text-sm text-zinc-400">Hours</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-500">{timeToRegistration.minutes}</div>
                      <div className="text-sm text-zinc-400">Minutes</div>
                    </div>
                  </div>
                </div>

                {/* Hackathon Start Countdown */}
                <div className="bg-zinc-900 p-6 rounded-xl">
                  <h3 className="text-xl mb-4">Hackathon Starts In</h3>
                  <div className="flex justify-around text-center">
                    <div>
                      <div className="text-3xl font-bold text-green-500">{timeToStart.days}</div>
                      <div className="text-sm text-zinc-400">Days</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-500">{timeToStart.hours}</div>
                      <div className="text-sm text-zinc-400">Hours</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-500">{timeToStart.minutes}</div>
                      <div className="text-sm text-zinc-400">Minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && !timelineConfigured && (
            <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
              {/* Default Timeline Content */}
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
                        d={`M0 50 ${hackathon.schedule.map((_, index) => {
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
                        d={`M0 50 ${hackathon.schedule.map((_, index) => {
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
                                <button
                                  onClick={() => handleEditEvent(event, index)}
                                  className="ml-2 p-1 text-sm text-zinc-400 hover:text-blue-400 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
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
          )}

          {activeTab === 'timeline' && timelineConfigured && (
            <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
              {/* Configured Timeline Content */}
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
                                <button
                                  onClick={() => handleEditEvent(event, index)}
                                  className="ml-2 p-1 text-sm text-zinc-400 hover:text-blue-400 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
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
            </div>
          )}
        </motion.div>
      </div>

      {/* Organizer Modal */}
      {showOrganizerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Organizer Details</h2>
              <button
                onClick={() => setShowOrganizerModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Name</label>
                <p className="text-white">{hackathon.organizer.name}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Organization</label>
                <p className="text-white">{hackathon.organizer.organization}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Email</label>
                <a href={`mailto:${hackathon.organizer.email}`} className="block text-blue-400 hover:underline">
                  {hackathon.organizer.email}
                </a>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Phone</label>
                <a href={`tel:${hackathon.organizer.phone}`} className="block text-blue-400 hover:underline">
                  {hackathon.organizer.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Configuration Modal */}
      {showTimelineConfig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Configure Timeline</h2>
              <button
                onClick={() => {
                  setShowTimelineConfig(false)
                  setActiveTab('analytics')
                }}
                className="text-zinc-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-8 p-4 bg-zinc-800/50 rounded-xl">
              <h3 className="text-lg font-medium mb-4">Quick Start with AI</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Let AI generate a timeline based on your hackathon duration and best practices.
              </p>
              <button
                onClick={generateAITimeline}
                disabled={isGeneratingAI}
                className={`w-full py-3 px-4 rounded-lg text-white transition-colors flex items-center justify-center space-x-2
                  ${isGeneratingAI 
                    ? 'bg-zinc-700 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                  }`}
              >
                {isGeneratingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Timeline...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-400">Or create manually</span>
              </div>
            </div>
            
            <form onSubmit={handleTimelineConfig} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Number of Timeline Events
                  </label>
                  <input
                    type="number"
                    name="numEvents"
                    min="1"
                    max="10"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    onChange={(e) => {
                      const form = e.target.form
                      const numEvents = parseInt(e.target.value)
                      const eventsContainer = form.querySelector('#eventsContainer')
                      
                      // Clear existing event fields
                      eventsContainer.innerHTML = ''
                      
                      // Add new event fields
                      for (let i = 0; i < numEvents; i++) {
                        const eventDiv = document.createElement('div')
                        eventDiv.className = 'space-y-4 border border-zinc-800 rounded-lg p-4 mt-4'
                        eventDiv.innerHTML = `
                          <h3 class="text-lg font-medium">Event ${i + 1}</h3>
                          <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Event Name</label>
                            <input
                              type="text"
                              name="event${i}Name"
                              required
                              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                              placeholder="e.g., Kickoff Meeting"
                            />
                          </div>
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <label class="block text-sm font-medium text-zinc-400 mb-2">Start Time</label>
                              <input
                                type="time"
                                name="event${i}StartTime"
                                required
                                class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label class="block text-sm font-medium text-zinc-400 mb-2">End Time</label>
                              <input
                                type="time"
                                name="event${i}EndTime"
                                required
                                class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                            <textarea
                              name="event${i}Description"
                              required
                              rows="2"
                              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                              placeholder="Brief description of the event"
                            ></textarea>
                          </div>
                        `
                        eventsContainer.appendChild(eventDiv)
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div id="eventsContainer" className="space-y-6">
                {/* Event fields will be dynamically added here */}
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTimelineConfig(false)
                    setActiveTab('analytics')
                  }}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                >
                  Create Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Edit Event</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingEvent(null)
                }}
                className="text-zinc-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateEvent} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  name="eventName"
                  required
                  defaultValue={editingEvent.phase}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  required
                  defaultValue={editingEvent.date}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="eventStartTime"
                    required
                    defaultValue={editingEvent.startTime}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="eventEndTime"
                    required
                    defaultValue={editingEvent.endTime}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Description
                </label>
                <textarea
                  name="eventDescription"
                  required
                  rows="3"
                  defaultValue={editingEvent.description}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingEvent(null)
                  }}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Submission Modal */}
      {currentCheckpoint?.checkpointType === 'documents' && currentCheckpoint?.status === 'current' && (
        <div className="fixed bottom-4 right-4 w-96 bg-zinc-900 rounded-xl shadow-lg border border-zinc-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Document Submission</h3>
              <button 
                onClick={() => setCurrentCheckpoint(null)}
                className="text-zinc-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
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

      {/* Problem Statement Modal */}
      {showProblemStatementModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Problem Statements</h2>
              <button
                onClick={() => setShowProblemStatementModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Organizer Controls */}
            {hackathon.organizer.email === "john@techinnovators.com" && (
              <div className="mb-6 p-4 bg-zinc-800 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Add New Problem Statement</h3>
                <form onSubmit={handleProblemStatementUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Domain</label>
                    <select
                      name="domain"
                      required
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="Web Dev">Web Development</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="Mobile">Mobile Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
                  >
                    Add Problem Statement
                  </button>
                </form>
              </div>
            )}

            {/* Problem Statements List */}
            <div className="space-y-6">
              {Object.entries(problemStatements).map(([domain, statements]) => (
                <div key={domain}>
                  <h3 className="text-lg font-medium mb-4">{domain}</h3>
                  <div className="space-y-4">
                    {statements.map((statement) => (
                      <div key={statement.id} className="bg-zinc-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2">{statement.title}</h4>
                        <p className="text-sm text-zinc-400 mb-4">{statement.description}</p>
                        <button
                          onClick={() => handleProblemStatementSelection(statement)}
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          Select Problem Statement
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Ideation Modal */}
      {showAIIdeationModal && selectedProblemStatement && (
        <div className="fixed bottom-4 right-4 w-96 bg-zinc-900 rounded-xl shadow-lg border border-zinc-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Ideation Assistant</h3>
              <button
                onClick={() => setShowAIIdeationModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Selected Problem</h4>
                <p className="text-sm">{selectedProblemStatement.title}</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4 h-64 overflow-y-auto">
                <h4 className="text-sm font-medium text-zinc-400 mb-2">AI Suggestions</h4>
                <div className="space-y-3">
                  <p className="text-sm text-zinc-300">
                    Here are some potential approaches to solve this problem:
                  </p>
                  {/* AI suggestions will be populated here */}
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask AI for ideas..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm">
                  Ask AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 