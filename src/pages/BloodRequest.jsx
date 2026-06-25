import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiPhone, FiUser, FiMapPin } from 'react-icons/fi';
import { FaTint, FaHospital } from 'react-icons/fa';
import { BLOOD_GROUPS, BLOOD_REQUESTS } from '../data/dummy';
import { useApp } from '../context/AppContext';

const URGENCY = ['Normal', 'Urgent', 'Critical'];
const init = { patientName: '', bloodGroup: '', hospital: '', units: 1, urgency: 'Urgent', contact: '', notes: '' };

export default function BloodRequest() {
  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Patient name required';
    if (!form.bloodGroup) e.bloodGroup = 'Blood group required';
    if (!form.hospital.trim()) e.hospital = 'Hospital name required';
    if (!form.units || form.units < 1) e.units = 'At least 1 unit required';
    if (!form.contact || !/^\d{10}$/.test(form.contact.replace(/\D/g, ''))) e.contact = 'Valid 10-digit number required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast('Blood request submitted! Donors in your area will be notified.', 'success');
    }, 1500);
  };

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const urgencyColors = { Normal: 'bg-blue-100 text-blue-700 border-blue-200', Urgent: 'bg-orange-100 text-orange-700 border-orange-200', Critical: 'bg-red-100 text-red-700 border-red-200' };

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Request Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">Your emergency blood request has been received.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">We are notifying all available <strong>{form.bloodGroup}</strong> donors in your area. You will receive calls shortly.</p>
          <div className="card p-5 mb-6 text-left space-y-2.5">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Patient</span><span className="font-semibold dark:text-white">{form.patientName}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Blood Required</span><span className="font-semibold text-red-600">{form.bloodGroup} × {form.units} unit(s)</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Hospital</span><span className="font-semibold dark:text-white">{form.hospital}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Urgency</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${urgencyColors[form.urgency]}`}>{form.urgency}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/find-donor" className="btn-primary">Find Donors Manually</Link>
            <Link to="/" className="btn-secondary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white/80 text-sm mb-4">
          <FiAlertCircle className="text-red-300 animate-pulse" /> Emergency Blood Request System
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Request Blood</h1>
        <p className="text-red-200">Submit your request and we'll connect you with donors immediately</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6 flex items-center gap-2">
                <FaTint className="text-red-500" /> Blood Request Form
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Patient Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <FiUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={form.patientName} onChange={e => set('patientName', e.target.value)} placeholder="Patient's full name" className={`input-field pl-10 ${errors.patientName ? 'border-red-400' : ''}`} />
                    </div>
                    {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
                  </div>
                  <div>
                    <label className="label">Blood Group Needed <span className="text-red-500">*</span></label>
                    <select value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)} className={`input-field ${errors.bloodGroup ? 'border-red-400' : ''}`}>
                      <option value="">Select blood group</option>
                      {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup}</p>}
                  </div>
                  <div>
                    <label className="label">Hospital Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <FaHospital size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={form.hospital} onChange={e => set('hospital', e.target.value)} placeholder="Hospital name" className={`input-field pl-10 ${errors.hospital ? 'border-red-400' : ''}`} />
                    </div>
                    {errors.hospital && <p className="text-red-500 text-xs mt-1">{errors.hospital}</p>}
                  </div>
                  <div>
                    <label className="label">Units Required <span className="text-red-500">*</span></label>
                    <input type="number" value={form.units} onChange={e => set('units', e.target.value)} min="1" max="10" className={`input-field ${errors.units ? 'border-red-400' : ''}`} />
                    {errors.units && <p className="text-red-500 text-xs mt-1">{errors.units}</p>}
                  </div>
                  <div>
                    <label className="label">Urgency Level <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      {URGENCY.map(u => (
                        <button type="button" key={u} onClick={() => set('urgency', u)}
                          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.urgency === u ? urgencyColors[u] : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Contact Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <FiPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="+91 98765 43210" className={`input-field pl-10 ${errors.contact ? 'border-red-400' : ''}`} />
                    </div>
                    {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                  </div>
                </div>
                <div>
                  <label className="label">Additional Notes</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Any additional information about the patient or urgency..." className="input-field resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-70">
                  {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting Request...</> : <><FiAlertCircle /> Submit Blood Request</>}
                </button>
              </form>
            </div>
          </div>

          {/* Active Requests Sidebar */}
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiAlertCircle className="text-red-500 animate-pulse" /> Active Requests Near You
              </h3>
              <div className="space-y-3">
                {BLOOD_REQUESTS.filter(r => r.status === 'Active').map(req => (
                  <div key={req.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{req.patientName}</span>
                      <span className="blood-badge !w-10 !h-7 text-xs">{req.bloodGroup}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <p className="flex items-center gap-1"><FaHospital size={11} /> {req.hospital}</p>
                      <p className="flex items-center gap-1"><FiMapPin size={11} /> {req.city}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${req.urgency === 'Critical' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-orange-100 text-orange-700'}`}>{req.urgency}</span>
                      <span className="text-xs text-gray-400">{req.units} unit(s)</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/find-donor" className="block mt-4 text-center text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium">
                View All Requests →
              </Link>
            </div>

            {/* Emergency Tips */}
            <div className="card p-5 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                <FiAlertCircle size={16} /> Emergency Tips
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-2">
                {['Also call 1800-BLOOD for immediate assistance', 'Contact nearby blood banks directly', 'Post on social media for faster reach', 'Check hospital blood bank first'].map(t => (
                  <li key={t} className="flex items-start gap-2"><span className="mt-1">•</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
