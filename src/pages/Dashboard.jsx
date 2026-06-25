import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiCalendar, FiBell, FiEdit, FiToggleLeft, FiToggleRight, FiDroplet, FiAward, FiCheck } from 'react-icons/fi';
import { FaTint, FaHeartbeat } from 'react-icons/fa';
import axios from 'axios';
import { DONATION_HISTORY } from '../data/dummy';
import { useApp } from '../context/AppContext';

const NOTIFICATIONS = []; // Cleared dummy notifications

export default function Dashboard() {
  const [available, setAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [showLogDonation, setShowLogDonation] = useState(false);
  const [donationForm, setDonationForm] = useState({ hospital: '', date: '', units: 1 });
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const { user, addToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return navigate('/login');
        
        const { data } = await axios.get('http://localhost:5000/api/donors/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
        setAvailable(data.isAvailable !== false);
        setEditForm({
          fullName: data.fullName,
          age: data.age,
          mobile: data.mobile,
          email: data.email,
          city: data.city,
          taluk: data.taluk
        });

        const { data: donData } = await axios.get('http://localhost:5000/api/donations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDonations(donData);
      } catch (err) {
        addToast('Failed to load profile. Please login again.', 'error');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate, addToast]);

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const newStatus = !available;
      await axios.put('http://localhost:5000/api/donors/profile', { isAvailable: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailable(newStatus);
      addToast(newStatus ? 'You are now available for donations!' : 'You are now marked as unavailable.', newStatus ? 'success' : 'info');
    } catch (err) {
      addToast('Failed to update availability status', 'error');
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const { data } = await axios.put('http://localhost:5000/api/donors/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(data);
      addToast('Profile updated successfully!', 'success');
      setActiveTab('overview');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogDonation = async (e) => {
    e.preventDefault();
    if (!donationForm.hospital || !donationForm.date) {
      return addToast('Please fill all fields', 'error');
    }
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/donations', {
        ...donationForm,
        bloodGroup: profile?.bloodGroup || 'O+'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations([data, ...donations]);
      setShowLogDonation(false);
      setDonationForm({ hospital: '', date: '', units: 1 });
      addToast('Donation logged successfully!', 'success');
    } catch (error) {
      addToast('Failed to log donation', 'error');
    }
  };

  const tabs = ['overview', 'donations', 'notifications', 'profile'];

  // Calculate Real Stats
  const totalDonations = donations.length;
  const livesSaved = donations.reduce((sum, d) => sum + (d.units * 3), 0); // 1 unit saves ~3 lives
  
  let nextEligible = 'Eligible Now';
  if (donations.length > 0) {
    const latestDate = new Date(Math.max(...donations.map(d => new Date(d.date).getTime())));
    const nextDate = new Date(latestDate.setDate(latestDate.getDate() + 90)); // 90 days cool-off
    if (nextDate > new Date()) {
      nextEligible = nextDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  }

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
            { icon: FaTint, label: 'Total Donations', value: totalDonations.toString(), color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
            { icon: FiAward, label: 'Lives Saved', value: livesSaved.toString(), color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30' },
            { icon: FaHeartbeat, label: 'Next Eligible', value: nextEligible, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
            { icon: FiBell, label: 'Notifications', value: '0', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
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
                  {donations.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No recent donations. Log one to get started!</p>
                  ) : (
                    donations.slice(0, 3).map(d => (
                      <div key={d._id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <FaTint size={16} className="text-red-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{d.hospital}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(d.date).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                          <FiCheck size={11} className="inline mr-1" />{d.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="space-y-5">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">My Profile</h3>
                  <button onClick={() => setActiveTab('profile')} className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1">
                    <FiEdit size={14} /> Edit
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Blood Group', value: profile?.bloodGroup || '-', highlight: true },
                    { label: 'Age', value: profile ? `${profile.age} years` : '-' },
                    { label: 'Gender', value: profile?.gender || '-' },
                    { label: 'Phone', value: profile?.mobile || '-' },
                    { label: 'City', value: profile?.city || '-' },
                    { label: 'Taluk', value: profile?.taluk || '-' },
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
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowLogDonation(!showLogDonation)} className="btn-primary flex items-center gap-2">
                <FiDroplet /> Log New Donation
              </button>
            </div>

            {showLogDonation && (
              <div className="card p-6 bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Log a Donation</h3>
                <form onSubmit={handleLogDonation} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="label">Hospital / Camp Name</label>
                    <input value={donationForm.hospital} onChange={e => setDonationForm(p => ({...p, hospital: e.target.value}))} className="input-field" placeholder="E.g., Apollo Hospital" required />
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input type="date" value={donationForm.date} onChange={e => setDonationForm(p => ({...p, date: e.target.value}))} className="input-field" max={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div>
                    <label className="label">Units Donated</label>
                    <input type="number" value={donationForm.units} onChange={e => setDonationForm(p => ({...p, units: e.target.value}))} className="input-field" min="1" max="4" required />
                  </div>
                  <div className="sm:col-span-3 flex gap-2 justify-end mt-2">
                    <button type="button" onClick={() => setShowLogDonation(false)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Save Donation</button>
                  </div>
                </form>
              </div>
            )}

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
                    {donations.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-6 text-gray-500">No donations recorded yet.</td></tr>
                    ) : (
                      donations.map(d => (
                        <tr key={d._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 text-gray-900 dark:text-white">{new Date(d.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.hospital}</td>
                          <td className="px-6 py-4"><span className="blood-badge !w-10 !h-7 text-xs">{d.bloodGroup}</span></td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.units}</td>
                          <td className="px-6 py-4"><span className="status-available"><FiCheck size={11} />{d.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {NOTIFICATIONS.length === 0 ? (
              <div className="card p-8 text-center">
                <FiBell size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">You have no new notifications.</p>
              </div>
            ) : (
              NOTIFICATIONS.map(n => (
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
              ))
            )}
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
                  { label: 'Full Name', key: 'fullName' },
                  { label: 'Age', key: 'age' },
                  { label: 'Mobile', key: 'mobile' },
                  { label: 'Email', key: 'email' },
                  { label: 'City', key: 'city' },
                  { label: 'Taluk', key: 'taluk' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="label">{f.label}</label>
                    <input 
                      value={editForm[f.key] || ''} 
                      onChange={(e) => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="input-field" 
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="btn-primary disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
