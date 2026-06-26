import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUsers, FiAlertCircle, FiCheckCircle, FiTrendingUp, FiSearch, FiTrash2, FiEdit, FiEye } from 'react-icons/fi';
import { FaTint } from 'react-icons/fa';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { API_URL } from "../config";

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [donorSearch, setDonorSearch] = useState('');
  const [reqSearch, setReqSearch] = useState('');
  
  const [stats, setStats] = useState(null);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, addToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [statsRes, donorsRes, reqsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/stats`, config),
        axios.get(`${API_URL}/api/admin/donors`, config),
        axios.get(`${API_URL}/api/admin/requests`, config)
      ]);
      
      setStats(statsRes.data);
      setDonors(donorsRes.data);
      setRequests(reqsRes.data);
    } catch (error) {
      addToast('Failed to fetch admin data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donor?')) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/donors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonors(donors.filter(d => d._id !== id));
      addToast('Donor deleted successfully.', 'success');
    } catch (error) {
      addToast('Failed to delete donor.', 'error');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(r => r._id !== id));
      addToast('Request deleted successfully.', 'success');
    } catch (error) {
      addToast('Failed to delete request.', 'error');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            You do not have administrator privileges to view this dashboard. Please contact system support if you believe this is an error.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
            <Link to="/" className="btn-primary">Return Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !stats || typeof stats !== 'object' || Array.isArray(stats)) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const safeDonors = Array.isArray(donors) ? donors : [];
  const safeReqs = Array.isArray(requests) ? requests : [];

  const filteredDonors = safeDonors.filter(d =>
    (d?.fullName || '').toLowerCase().includes(donorSearch.toLowerCase()) ||
    (d?.bloodGroup || '').includes(donorSearch) ||
    (d?.city || '').toLowerCase().includes(donorSearch.toLowerCase())
  );

  const filteredReqs = safeReqs.filter(r =>
    (r?.patientName || '').toLowerCase().includes(reqSearch.toLowerCase()) ||
    (r?.bloodGroup || '').includes(reqSearch) ||
    (r?.hospital || '').toLowerCase().includes(reqSearch.toLowerCase())
  );

  const urgencyColor = { Critical: 'status-urgent', Urgent: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', Normal: 'status-available' };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 dark:bg-gray-950 py-10 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Admin Panel</p>
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          </div>
          <div className="flex items-center gap-2 bg-red-600/20 border border-red-600/40 rounded-xl px-4 py-2">
            <FaTint className="text-red-400" />
            <span className="text-red-300 text-sm font-medium">Admin Access</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FiUsers, label: 'Total Donors', value: stats.totalDonors, change: `${stats.newDonorsThisMonth} this month`, color: 'blue' },
            { icon: FiAlertCircle, label: 'Active Requests', value: stats.activeRequests, change: 'Requires attention', color: 'red' },
            { icon: FiCheckCircle, label: 'Fulfilled Requests', value: stats.fulfilledRequests, change: 'Total resolved', color: 'green' },
            { icon: FiTrendingUp, label: 'New Donors/Month', value: stats.newDonorsThisMonth, change: 'Current month', color: 'purple' },
          ].map(s => {
            const colors = { blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400', green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400', purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' };
            return (
              <div key={s.label} className="card p-5">
                <div className={`w-10 h-10 rounded-xl ${colors[s.color]} flex items-center justify-center mb-3`}>
                  <s.icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{s.change}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {['overview', 'donors', 'requests'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === t ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              {t === 'overview' ? 'Overview' : t === 'donors' ? `Donors (${donors.length})` : `Requests (${requests.length})`}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blood Group Analytics */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Blood Group Distribution</h3>
              <div className="space-y-3">
                {(!stats.bloodGroupAnalytics || stats.bloodGroupAnalytics.length === 0) ? (
                  <p className="text-gray-500 text-sm">No donor data available.</p>
                ) : (
                  stats.bloodGroupAnalytics.map(bg => (
                    <div key={bg.group} className="flex items-center gap-3">
                      <div className="blood-badge !w-9 !h-9 text-xs flex-shrink-0">{bg.group}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>{bg.count} donors</span>
                          <span>{bg.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-500"
                            style={{ width: `${bg.percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity (Still static for now as we don't have an activity log collection) */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-5">System Logs</h3>
              <p className="text-sm text-gray-500">Live activity logs will appear here when the event tracking module is activated.</p>
            </div>
          </div>
        )}

        {/* Donors Table */}
        {activeTab === 'donors' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Donor Management</h3>
              <div className="relative">
                <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={donorSearch} onChange={e => setDonorSearch(e.target.value)}
                  placeholder="Search donors..." className="input-field pl-9 !py-2 text-sm w-full sm:w-64" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>{['Name', 'Blood Group', 'City', 'Phone', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredDonors.map(d => (
                    <tr key={d._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{(d.fullName || '?').charAt(0)}</div>
                          <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{d.fullName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><span className="blood-badge !w-10 !h-7 text-xs">{d.bloodGroup || 'N/A'}</span></td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">{d.city || 'N/A'}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">{d.mobile || 'N/A'}</td>
                      <td className="px-5 py-3.5">
                        <span className={d.isAvailable ? 'status-available' : 'status-unavailable'}>{d.isAvailable ? 'Available' : 'Unavailable'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleDeleteDonor(d._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete Donor">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              Showing {filteredDonors.length} of {donors.length} donors
            </div>
          </div>
        )}

        {/* Requests Table */}
        {activeTab === 'requests' && (
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Blood Request Management</h3>
              <div className="relative">
                <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={reqSearch} onChange={e => setReqSearch(e.target.value)}
                  placeholder="Search requests..." className="input-field pl-9 !py-2 text-sm w-full sm:w-64" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>{['Patient', 'Blood Group', 'Hospital', 'Units', 'Urgency', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredReqs.map(r => (
                    <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white whitespace-nowrap">{r.patientName || 'Unknown'}</td>
                      <td className="px-5 py-3.5"><span className="blood-badge !w-10 !h-7 text-xs">{r.bloodGroup || 'N/A'}</span></td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">{r.hospital || 'N/A'}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{r.units || 1}</td>
                      <td className="px-5 py-3.5"><span className={urgencyColor[r.urgency] || 'status-available'}>{r.urgency || 'Normal'}</span></td>
                      <td className="px-5 py-3.5"><span className={r.status === 'Active' ? 'status-available' : 'status-unavailable'}>{r.status || 'Active'}</span></td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleDeleteRequest(r._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete Request">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              Showing {filteredReqs.length} of {requests.length} requests
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
