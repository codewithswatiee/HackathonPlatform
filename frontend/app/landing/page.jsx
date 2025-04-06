'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import useMousePosition from '../../app/utils/useMousePosition';
import styles from './page.module.scss';

export default function Home() {
  const router = useRouter();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });
  
  // Transform values for each line based on scroll
  const line1X = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const line2X = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const line3X = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;


  const buttons = [
    {
      title: 'Organize a Hackathon',
      description: 'Create and manage your own hackathon events',
      icon: '🎯',
      path: '/organizer/register',
    },
    {
      title: 'Participate',
      description: 'Join exciting hackathons and showcase your skills',
      icon: '👥',
      path: '/participant/register',
    },
    {
      title: 'Become a Mentor',
      description: 'Guide and inspire participants with your expertise',
      icon: '🎓',
      path: '/mentor/register',
    },
    {
      title: 'Sponsor Hackathon',
      description: 'Support innovation and connect with talent',
      icon: '🌟',
      path: '/sponsor/register',
    }
  ];

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Organize', path: '/organizer/register' },
    { name: 'Participate', path: '/participant/register' },
    { name: 'Mentor', path: '/mentor/register' },
    { name: 'Sponsor', path: '/sponsor/register' },
  ];

  return (
    <main className="min-h-screen bg-zinc-900 font-['Lilita_One']" ref={targetRef}>
      {/* Google Fonts Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
      `}</style>
      
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-white text-xl">HackathonHub</span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.path}
                    className="text-gray-300 hover:text-white px-3 py-2 text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <Link 
                href="/login" 
                className="ml-4 inline-flex items-center px-4 py-2 border border-zinc-700 rounded-full text-sm text-white hover:bg-zinc-800 focus:outline-none transition duration-150 ease-in-out"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-20 relative">
        <div className="max-w-4xl mx-auto px-4 overflow-hidden">
          <span className="text-orange-500 text-xl">#</span>
          <div className="mb-6">
            <motion.h1 
              style={{ x: line1X }} 
              className="text-5xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight"
            >
              LEVEL UP YOUR
            </motion.h1>
            <motion.h1 
              style={{ x: line2X }} 
              className="text-5xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight"
            >
              HACKATHON WITH OUR
            </motion.h1>
            <motion.h1 
              style={{ x: line3X }} 
              className="text-5xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight"
            >
              PLATFORM
            </motion.h1>
          </div>
          <div className="flex flex-col items-center mt-8 space-y-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                onClick={() => router.push('/join')}
                className="inline-flex items-center px-6 py-3 border border-zinc-700 rounded-full text-base text-white bg-zinc-800 hover:bg-zinc-700 focus:outline-none transition duration-150 ease-in-out"
              >
                Join Us
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* Floating questions around the headline */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Organizer Question - Top Left */}
          <motion.div
            className="absolute top-[5%] left-[5%] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x: [-20, 30, -10, 20, -15],
              y: [-10, 20, -15, 5, -20] 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
          >
            <h3 className="text-xl font-bold text-white mb-3">Why become an Organizer?</h3>
            <button 
              onClick={() => router.push('/organizer/register')}
              className="text-orange-500 hover:text-yellow-400 transition-colors duration-300 flex items-center"
            >
              Learn more
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </motion.div>

          {/* Participant Question - Top Right */}
          <motion.div
            className="absolute top-[10%] right-[5%] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x: [15, -25, 10, -20, 15],
              y: [-15, 25, -5, 15, -10] 
            }}
            transition={{ 
              duration: 17, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
          >
            <h3 className="text-xl font-bold text-white mb-3">Why should you Participate?</h3>
            <button 
              onClick={() => router.push('/participant/register')}
              className="text-orange-500 hover:text-yellow-400 transition-colors duration-300 flex items-center"
            >
              Learn more
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </motion.div>

          {/* Mentor Question - Bottom Left */}
          <motion.div
            className="absolute bottom-[15%] left-[10%] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x: [-10, 20, -15, 10, -5],
              y: [10, -20, 15, -5, 10] 
            }}
            transition={{ 
              duration: 21, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
          >
            <h3 className="text-xl font-bold text-white mb-3">Why become a Mentor?</h3>
            <button 
              onClick={() => router.push('/mentor/register')}
              className="text-orange-500 hover:text-yellow-400 transition-colors duration-300 flex items-center"
            >
              Learn more
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </motion.div>

          {/* Sponsor Question - Bottom Right */}
          <motion.div
            className="absolute bottom-[10%] right-[10%] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x: [10, -20, 15, -10, 5],
              y: [15, -10, 20, -15, 5] 
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
          >
            <h3 className="text-xl font-bold text-white mb-3">Why sponsor a Hackathon?</h3>
            <button 
              onClick={() => router.push('/sponsor/register')}
              className="text-orange-500 hover:text-yellow-400 transition-colors duration-300 flex items-center"
            >
              Learn more
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Visual Designer Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto">
          <main className={styles.main}>
            <motion.div 
              className={styles.mask}
              animate={{
                WebkitMaskPosition: `${x - (size/2)}px ${y - (size/2)}px`,
                WebkitMaskSize: `${size}px`,
              }}
              transition={{ type: "tween", ease: "backOut", duration:0.5}}
            >
              <p onMouseEnter={() => {setIsHovered(true)}} onMouseLeave={() => {setIsHovered(false)}}>
                A visual designer - with skills that haven't been replaced by A.I (yet) - making good shit only if the paycheck is equally good.
              </p>
            </motion.div>

            <div className={styles.body}>
              <p>I'm a <span>selectively skilled</span> product designer with strong focus on producing high quality & impactful digital experience.</p>
            </div>
          </main>
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
                className="w-full h-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 transition-all duration-300 hover:bg-zinc-800 text-white group-hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] flex flex-col items-center text-center"
              >
                <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {button.icon}
                </div>
                <h2 className="text-2xl mb-3">{button.title}</h2>
                <p className="text-zinc-400 group-hover:text-zinc-300 font-sans">{button.description}</p>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors duration-300 text-center">
              <h3 className="text-xl mb-3 text-white">Easy to Use</h3>
              <p className="text-zinc-400 font-sans">Simple and intuitive platform for all your hackathon needs</p>
            </div>
            <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors duration-300 text-center">
              <h3 className="text-xl mb-3 text-white">Secure Platform</h3>
              <p className="text-zinc-400 font-sans">Your data is protected with enterprise-grade security</p>
            </div>
            <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors duration-300 text-center">
              <h3 className="text-xl mb-3 text-white">24/7 Support</h3>
              <p className="text-zinc-400 font-sans">Round-the-clock assistance for all participants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-zinc-400 text-center">
              © 2024 HackathonHub
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}