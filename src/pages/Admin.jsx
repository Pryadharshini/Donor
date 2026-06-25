import { useState } from 'react';
import { FiUsers, FiAlertCircle, FiCheckCircle, FiTrendingUp, FiSearch, FiTrash2, FiEdit, FiEye } from 'react-icons/fi';
import { FaTint } from 'react-icons/fa';
import { DONORS, BLOOD_REQUESTS, ADMIN_STATS, BLOOD_GROUP_ANALYTICS } from '../data/dummy';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [donorSearch, setDonorSearch] = useState('');
  const [reqSearch, setReqSearch] = useState('');

  const filteredDonors = DONORS.filter(d =>
    d.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
    d.bloodGroup.includes(donorSearch) ||
    d.city.toLowerCase().includes(donorSearch.toLowerCase())
  );

  const filteredReqs = BLOOD_REQUESTS.filter(r =>
    r.patientName.toLowerCase().includes(reqSearch.toLowerCase()) ||
    r.bloodGroup.includes(reqSearch) ||
    r.hospital.toLowerCase().includes(reqSearch.toLowerCase())
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
            { icon: FiUsers, label: 'Total Donors', value: ADMIN_STATS.totalDonors.toLocaleString(), change: '+342 this month', color: 'blue' },
            { icon: FiAlertCircle, label: 'Active Requests', value: ADMIN_STATS.activeRequests, change: '12 critical', color: 'red' },
            { icon: FiCheckCircle, label: 'Fulfilled Requests', value: ADMIN_STATS.fulfilledRequests.toLocaleString(), change: '+89 this week', color: 'green' },
            { icon: FiTrendingUp, label: 'New Donors/Month', value: ADMIN_STATS.newDonorsThisMonth, change: '+12% vs last month', color: 'purple' },
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
              {t === 'overview' ? 'Overview' : t === 'donors' ? `Donors (${DONORS.length})` : `Requests (${BLOOD_REQUESTS.length})`}
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
                {BLOOD_GROUP_ANALYTICS.map(bg => (
                  <div key={bg.group} className="flex items-center gap-3">
                    <div className="blood-badge !w-9 !h-9 text-xs flex-shrink-0">{bg.group}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>{bg.count.toLocaleString()} donors</span>
                        <span>{bg.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-500"
                          style={{ width: `${bg.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { icon: FiUsers, text: 'New donor registered: Priya S from Bangalore', time: '5 min ago', color: 'green' },
                  { icon: FiAlertCircle, text: 'Critical blood request: O- needed at AIIMS Delhi', time: '12 min ago', color: 'red' },
                  { icon: FiCheckCircle, text: 'Blood request fulfilled: A+ at Apollo Chennai', time: '1 hr ago', color: 'green' },
                  { icon: FiUsers, text: '5 new donors registered in Tamil Nadu', time: '2 hrs ago', color: 'blue' },
                  { icon: FiAlertCircle, text: 'Urgent: AB- needed at Fortis Bangalore', time: '3 hrs ago', color: 'orange' },
                ].map((a, i) => {
                  const dotColors = { green: 'bg-green-500', red: 'bg-red-500', blue: 'bg-blue-500', orange: 'bg-orange-500' };
                  return (
                    <div key={i} className="flex items-start gap-3 text-sm py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <div className={`w-2 h-2 rounded-full ${dotColors[a.color]} mt-1.5 flex-shrink-0`} />
                      <div className="flex-1">
                        <p className="text-gray-700 dark:text-gray-300">{a.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                  <tr>{['Name', 'Blood Group', 'City', 'Phone', 'Status', 'Donations', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredDonors.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{d.name.charAt(0)}</div>
                          <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><span className="blood-badge !w-10 !h-7 text-xs">{d.bloodGroup}</span></td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">{d.city}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">{d.phone}</td>
                      <td className="px-5 py-3.5">
                        <span className={d.available ? 'status-available' : 'status-unavailable'}>{d.available ? 'Available' : 'Unavailable'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{d.donations}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"><FiEye size={15} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 transition-colors"><FiEdit size={15} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"><FiTrash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              Showing {filteredDonors.length} of {DONORS.length} donors
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
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white whitespace-nowrap">{r.patientName}</td>
                      <td className="px-5 py-3.5"><span className="blood-badge !w-10 !h-7 text-xs">{r.bloodGroup}</span></td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">{r.hospital}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{r.units}</td>
                      <td className="px-5 py-3.5"><span className={urgencyColor[r.urgency] || 'status-available'}>{r.urgency}</span></td>
                      <td className="px-5 py-3.5"><span className={r.status === 'Active' ? 'status-available' : 'status-unavailable'}>{r.status}</span></td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{r.createdAt}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"><FiEye size={15} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500 transition-colors"><FiEdit size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              Showing {filteredReqs.length} of {BLOOD_REQUESTS.length} requests
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
