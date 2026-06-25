import { FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaTint } from 'react-icons/fa';

export default function DonorCard({ donor }) {
  const canDonate = () => {
    if (!donor.lastDonation) return true;
    const last = new Date(donor.lastDonation);
    const now = new Date();
    const diffDays = (now - last) / (1000 * 60 * 60 * 24);
    return diffDays >= 90;
  };

  const eligible = canDonate();

  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {donor.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{donor.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{donor.age} yrs • {donor.gender}</p>
          </div>
        </div>
        <div className="blood-badge text-sm">{donor.bloodGroup}</div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FiMapPin size={14} className="text-red-400 flex-shrink-0" />
          {donor.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FiCalendar size={14} className="text-red-400 flex-shrink-0" />
          Last donated: {donor.lastDonation || 'New donor'}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FaTint size={14} className="text-red-400 flex-shrink-0" />
          {donor.donations} donations total
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {donor.available && eligible ? (
            <span className="status-available"><FiCheckCircle size={11} /> Available</span>
          ) : (
            <span className="status-unavailable"><FiXCircle size={11} /> Unavailable</span>
          )}
        </div>
        <a href={`tel:${donor.phone}`}
          className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
          <FiPhone size={14} /> Contact
        </a>
      </div>
    </div>
  );
}
