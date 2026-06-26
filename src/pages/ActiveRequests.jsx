import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiAlertCircle, FiMapPin, FiCalendar } from 'react-icons/fi';
import { FaHospital, FaTint } from 'react-icons/fa';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { API_URL } from "../config";

export default function ActiveRequests() {
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/requests`);
        setActiveRequests(data);
      } catch (err) {
        console.error('Failed to fetch requests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user, navigate]);

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white/80 text-sm mb-4">
          <FiAlertCircle className="text-red-300 animate-pulse" /> Emergency Response Center
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Active Emergency Requests</h1>
        <p className="text-red-200">Browse current blood requests and help save a life today</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Grid */}
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6 flex items-center gap-2">
              <FaTint className="text-red-500" /> Requests in Need
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : activeRequests.length === 0 ? (
              <div className="card p-12 text-center">
                <FiAlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No active requests</h3>
                <p className="text-gray-500">There are no emergency requests in the system right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeRequests.map(req => (
                  <div key={req._id} className="card p-5 border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900 dark:text-white text-lg">{req.patientName}</span>
                      <span className="blood-badge !w-12 !h-12 text-lg">{req.bloodGroup}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                      <p className="flex items-center gap-2"><FaHospital className="text-red-400" /> {req.hospital}</p>
                      {req.city && <p className="flex items-center gap-2"><FiMapPin className="text-red-400" /> {req.city}, {req.taluk}</p>}
                      <p className="flex items-center gap-2"><FaTint className="text-red-400" /> Needs {req.units} unit(s)</p>
                      <p className="flex items-center gap-2"><FiCalendar className="text-red-400" /> {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${req.urgency === 'Critical' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-orange-100 text-orange-700'}`}>
                        {req.urgency} Priority
                      </span>
                      <a href={`tel:${req.contact}`} className="btn-primary !py-1.5 !px-4 text-sm flex items-center gap-2">
                        Contact Patient
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Emergency Tips */}
            <div className="card p-5 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                <FiAlertCircle size={16} /> Emergency Tips
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-3">
                <li className="flex items-start gap-2"><span className="mt-0.5 font-bold">•</span> Only contact the patient if you are ready to donate immediately.</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 font-bold">•</span> Verify with the hospital directly if you arrive on site.</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 font-bold">•</span> Hydrate well before donating blood.</li>
              </ul>
            </div>
            
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Blood?</h3>
              <p className="text-sm text-gray-500 mb-4">If you are in an emergency and need blood, submit a request immediately.</p>
              <Link to="/blood-request" className="w-full btn-primary block text-center text-sm">
                Create Blood Request
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
