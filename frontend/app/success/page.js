'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">Registration Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for registering as a hackathon organizer. We'll review your application and get back to you soon.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </motion.button>
      </motion.div>
    </div>
  );
} 