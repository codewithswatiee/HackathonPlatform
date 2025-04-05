import { CalendarIcon, CurrencyDollarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HackathonCard({ hackathon }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    if (!amount) return 'TBA'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <Link href={`/organizer/hackathon/${hackathon.id}/analytics`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-xl p-6 hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <h3 className="text-xl font-semibold mb-2">{hackathon.name}</h3>
        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{hackathon.description || 'No description provided'}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-zinc-300">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>
              {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-zinc-300">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span>{hackathon.location || 'Location TBA'}</span>
          </div>
          
          <div className="flex items-center text-sm text-zinc-300">
            <UsersIcon className="w-4 h-4 mr-2" />
            <span>Team Size: {hackathon.minTeamSize || '?'} - {hackathon.maxTeamSize || '?'}</span>
          </div>
          
          <div className="flex items-center text-sm text-zinc-300">
            <CurrencyDollarIcon className="w-4 h-4 mr-2" />
            <span>Prize Pool: {formatCurrency(hackathon.prizePool)}</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {hackathon.domains ? (
            hackathon.domains.split(',').map((domain, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full"
              >
                {domain.trim()}
              </span>
            ))
          ) : (
            <span className="text-xs text-zinc-500">No domains specified</span>
          )}
        </div>
      </motion.div>
    </Link>
  )
} 