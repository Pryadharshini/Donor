import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiBell, FiEdit, FiToggleLeft, FiToggleRight, FiDroplet, FiAward, FiCheck } from 'react-icons/fi';
import { FaTint, FaHeartbeat } from 'react-icons/fa';
import { DONATION_HISTORY } from '../data/dummy';
import { useApp } from '../context/AppContext';

const NOTIFICATIONS = [
  { id: 1, type: 'request', message: 'O+ blood needed urgently at Apollo Hospital, Chennai', time: '10 min ago', urgent: true },
  { id: 2, type: 'reminder', message: 'You are now eligible to donate again!', time: '2 hours ago', urgent: false },
  { id: 3, type: 'thanks', message: 'Thank you! Your last donation helped save a life.', time: '3 days ago', urgent: false },
];

export default function Dashboard() {
  const [available, setAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, addToast } = useApp();

  const toggleAvailability = () => {
    setAvailable(!available);
    addToast(available ? 'You are now marked as unavailable.' : 'You are now available for donations!', available ? 'info' : 'success');
  };

  const tabs = ['overview', 'donations', 'notifications', 'profile'];

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'R'}
              </div>
              <div>
                <p className="text-red-200 text-sm">Welcome back,</p>
                <h1 className="text-2xl font-bold text-white">{user?.name || 'Rajan Kumar'}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="blood-badge !w-8 !h-8 text-xs">{user?.bloodGroup || 'O+'}</span>
                  <span className="text-red-200 text-sm">Registered Donor</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-200 text-sm">Availability:</span>
              <button onClick={toggleAvailability}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${available ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white'}`}>
                {available ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                {available ? 'Available' : 'Unavailable'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FaTint, label: 'Total Donations', value: '3', color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
            { icon: FiAward, label: 'Lives Saved', value: '9', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30' },
            { icon: FaHeartbeat, label: 'Next Eligible', value: 'Apr 15', color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
            { icon: FiBell, label: 'Notifications', value: '3', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon size={20} className={s.color.split(' ')[0]} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize rounded-t-lg transition-colors ${activeTab === t ? 'bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Donations */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiDroplet className="text-red-500" /> Recent Donations
                </h3>
                <div className="space-y-3">
                  {DONATION_HISTORY.slice(0, 3).map(d => (
                    <div key={d.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <FaTint size={16} className="text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{d.hospital}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{d.date}</p>
                      </div>
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                        <FiCheck size={11} className="inline mr-1" />{d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="space-y-5">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">My Profile</h3>
                  <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1">
                    <FiEdit size={14} /> Edit
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Blood Group', value: 'O+', highlight: true },
                    { label: 'Age', value: '28 years' },
                    { label: 'Gender', value: 'Male' },
                    { label: 'Phone', value: '+91 98765 43210' },
                    { label: 'City', value: 'Chennai' },
                    { label: 'State', value: 'Tamil Nadu' },
                  ].map(f => (
                    <div key={f.label} className="flex justify-between items-center py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <span className="text-gray-500 dark:text-gray-400">{f.label}</span>
                      <span className={`font-medium ${f.highlight ? 'text-red-600 dark:text-red-400 text-lg' : 'text-gray-900 dark:text-white'}`}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Donation History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>{['Date', 'Hospital', 'Blood Group', 'Units', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {DONATION_HISTORY.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{d.date}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.hospital}</td>
                      <td className="px-6 py-4"><span className="blood-badge !w-10 !h-7 text-xs">{d.bloodGroup}</span></td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.units}</td>
                      <td className="px-6 py-4"><span className="status-available"><FiCheck size={11} />{d.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {NOTIFICATIONS.map(n => (
              <div key={n.id} className={`card p-5 flex items-start gap-4 ${n.urgent ? 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.urgent ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {n.type === 'request' ? <FaTint className={n.urgent ? 'text-red-500 animate-pulse' : 'text-gray-500'} /> : n.type === 'reminder' ? <FiCalendar className="text-blue-500" /> : <FiAward className="text-yellow-500" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${n.urgent ? 'font-semibold text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
                {n.urgent && <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">URGENT</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="card p-8">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-6 flex items-center gap-2">
                <FiUser className="text-red-500" /> Edit Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', defaultValue: 'Rajan Kumar' },
                  { label: 'Age', defaultValue: '28' },
                  { label: 'Mobile', defaultValue: '+91 98765 43210' },
                  { label: 'Email', defaultValue: 'rajan@example.com' },
                  { label: 'City', defaultValue: 'Chennai' },
                  { label: 'State', defaultValue: 'Tamil Nadu' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="label">{f.label}</label>
                    <input defaultValue={f.defaultValue} className="input-field" />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button className="btn-primary">Save Changes</button>
                <button className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
