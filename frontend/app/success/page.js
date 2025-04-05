'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-zinc-900 rounded-lg shadow-xl p-8 border border-zinc-800 text-center"
      >
        <motion.div
          variants={itemVariants}
          className="text-6xl mb-6"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          🎉
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold mb-4"
        >
          Registration Successful!
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-zinc-400 mb-8"
        >
          Thank you for registering as a hackathon organizer. We'll review your application and get back to you soon.
        </motion.p>

        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors font-medium"
          >
            Return to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
} 