'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const buttons = [
    {
      title: 'Organize a Hackathon',
      description: 'Create and manage your own hackathon events',
      icon: '🎯',
      path: '/register'
    },
    {
      title: 'Participate',
      description: 'Join exciting hackathons and showcase your skills',
      icon: '👥',
      path: '/participant-register'
    },
    {
      title: 'Become a Mentor',
      description: 'Guide and inspire participants with your expertise',
      icon: '🎓',
      path: '/mentor-register'
    },
    {
      title: 'Sponsor Hackathon',
      description: 'Support innovation and connect with talent',
      icon: '🌟',
      path: '/sponsor-register'
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/5 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              Welcome to HackathonHub
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Your gateway to amazing hackathon experiences. Whether you want to organize,
              participate, mentor, or sponsor - we've got you covered!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {buttons.map((button, index) => (
            <motion.div
              key={button.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <button
                onClick={() => router.push(button.path)}
                className="w-full h-full bg-white border-2 border-black rounded-xl p-8 transition-all duration-300
                         hover:bg-black hover:text-white group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                         flex flex-col items-center text-center"
              >
                <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {button.icon}
                </div>
                <h2 className="text-2xl font-bold mb-3">{button.title}</h2>
                <p className="text-gray-600 group-hover:text-gray-300">{button.description}</p>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border-2 border-black rounded-xl">
              <h3 className="text-xl font-bold mb-3">Easy to Use</h3>
              <p className="text-gray-600">Simple and intuitive platform for all your hackathon needs</p>
            </div>
            <div className="p-6 border-2 border-black rounded-xl">
              <h3 className="text-xl font-bold mb-3">Secure Platform</h3>
              <p className="text-gray-600">Your data is protected with enterprise-grade security</p>
            </div>
            <div className="p-6 border-2 border-black rounded-xl">
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance for all participants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-black">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-black font-medium">
              © 2024 HackathonHub
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
