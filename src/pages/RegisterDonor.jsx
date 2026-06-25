import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { FaTint } from 'react-icons/fa';
import { BLOOD_GROUPS } from '../data/dummy';
import { useApp } from '../context/AppContext';

const initialForm = {
  fullName: '', age: '', gender: '', bloodGroup: '', mobile: '', email: '',
  address: '', countryCode: 'IN', stateCode: '', city: '',
  lastDonation: '', agreeTerms: false, agreeContact: false,
};

export default function RegisterDonor() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();

  // Derived lists
  const allCountries = useMemo(() => Country.getAllCountries(), []);

  const states = useMemo(
    () => (form.countryCode ? State.getStatesOfCountry(form.countryCode) : []),
    [form.countryCode]
  );

  const cities = useMemo(
    () =>
      form.countryCode && form.stateCode
        ? City.getCitiesOfState(form.countryCode, form.stateCode)
        : [],
    [form.countryCode, form.stateCode]
  );

  // Human-readable names for display / submission
  const selectedCountryName = useMemo(
    () => allCountries.find((c) => c.isoCode === form.countryCode)?.name || '',
    [allCountries, form.countryCode]
  );
  const selectedStateName = useMemo(
    () => states.find((s) => s.isoCode === form.stateCode)?.name || '',
    [states, form.stateCode]
  );

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.age || form.age < 18 || form.age > 65) e.age = 'Age must be between 18-65';
    if (!form.gender) e.gender = 'Gender is required';
    if (!form.bloodGroup) e.bloodGroup = 'Blood group is required';
    if (!form.mobile || !/^\d{10}$/.test(form.mobile.replace(/\s/g, ''))) e.mobile = 'Valid 10-digit mobile required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.countryCode) e.countryCode = 'Country is required';
    if (!form.stateCode) e.stateCode = 'State is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to terms';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast('Registration successful! Welcome to Nanbargal Blood Foundation.', 'success');
    }, 1500);
  };

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const handleCountryChange = (v) => {
    setForm((p) => ({ ...p, countryCode: v, stateCode: '', city: '' }));
    setErrors((p) => ({ ...p, countryCode: '', stateCode: '', city: '' }));
  };

  const handleStateChange = (v) => {
    setForm((p) => ({ ...p, stateCode: v, city: '' }));
    setErrors((p) => ({ ...p, stateCode: '', city: '' }));
  };

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Registration Successful!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Welcome to the Nanbargal Blood Foundation family, <strong>{form.fullName}</strong>!
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Your profile is now active. Blood seekers in your area may contact you when they need{' '}
            <strong>{form.bloodGroup}</strong> blood.
          </p>
          <div className="card p-5 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Blood Group</span>
              <span className="font-semibold text-red-600">{form.bloodGroup}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Location</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {form.city}, {selectedStateName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mobile</span>
              <span className="font-semibold text-gray-900 dark:text-white">{form.mobile}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/dashboard" className="btn-primary">View Dashboard</Link>
            <Link to="/" className="btn-secondary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const Field = ({ label, error, children, required }) => (
    <div>
      <label className="label">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <FiCheckCircle size={11} />{error}
        </p>
      )}
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Become a Blood Donor</h1>
        <p className="text-red-200">Register today and be ready to save lives in your community</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Personal Info */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                <FiUser size={18} className="text-red-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" error={errors.fullName} required>
                  <input
                    value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={`input-field ${errors.fullName ? 'border-red-400' : ''}`}
                  />
                </Field>
                <Field label="Age" error={errors.age} required>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => set('age', e.target.value)}
                    placeholder="18-65 years"
                    min="18" max="65"
                    className={`input-field ${errors.age ? 'border-red-400' : ''}`}
                  />
                </Field>
                <Field label="Gender" error={errors.gender} required>
                  <select
                    value={form.gender}
                    onChange={(e) => set('gender', e.target.value)}
                    className={`input-field ${errors.gender ? 'border-red-400' : ''}`}
                  >
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Blood Group" error={errors.bloodGroup} required>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => set('bloodGroup', e.target.value)}
                    className={`input-field ${errors.bloodGroup ? 'border-red-400' : ''}`}
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                <FiPhone size={18} className="text-red-500" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Mobile Number" error={errors.mobile} required>
                  <input
                    value={form.mobile}
                    onChange={(e) => set('mobile', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`input-field ${errors.mobile ? 'border-red-400' : ''}`}
                  />
                </Field>
                <Field label="Email Address" error={errors.email} required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="your@email.com"
                    className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                  />
                </Field>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                <FiMapPin size={18} className="text-red-500" /> Address Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Field label="Address">
                    <input
                      value={form.address}
                      onChange={(e) => set('address', e.target.value)}
                      placeholder="Street address"
                      className="input-field"
                    />
                  </Field>
                </div>

                {/* Country */}
                <Field label="Country" error={errors.countryCode} required>
                  <select
                    value={form.countryCode}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`input-field ${errors.countryCode ? 'border-red-400' : ''}`}
                  >
                    <option value="">Select country</option>
                    {allCountries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* State */}
                <Field label="State / Province" error={errors.stateCode} required>
                  <select
                    value={form.stateCode}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className={`input-field ${errors.stateCode ? 'border-red-400' : ''}`}
                    disabled={!form.countryCode}
                  >
                    <option value="">Select state</option>
                    {states.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                    ))}
                  </select>
                </Field>

                {/* City — dropdown if library has cities, else free text */}
                <Field label="City" error={errors.city} required>
                  {cities.length > 0 ? (
                    <select
                      value={form.city}
                      onChange={(e) => set('city', e.target.value)}
                      className={`input-field ${errors.city ? 'border-red-400' : ''}`}
                      disabled={!form.stateCode}
                    >
                      <option value="">Select city</option>
                      {cities.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form.city}
                      onChange={(e) => set('city', e.target.value)}
                      placeholder="Enter city"
                      className={`input-field ${errors.city ? 'border-red-400' : ''}`}
                    />
                  )}
                </Field>
              </div>
            </div>

            {/* Donation History */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                <FiCalendar size={18} className="text-red-500" /> Donation History
              </h3>
              <Field label="Last Donation Date">
                <input
                  type="date"
                  value={form.lastDonation}
                  onChange={(e) => set('lastDonation', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </Field>
            </div>

            {/* Terms */}
            <div className="space-y-3">
              <label className={`flex items-start gap-3 cursor-pointer ${errors.agreeTerms ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => set('agreeTerms', e.target.checked)}
                  className="mt-1 accent-red-600"
                />
                <span className="text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-red-600 hover:underline">Terms &amp; Conditions</a>{' '}
                  and{' '}
                  <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>.
                  I confirm I am medically fit to donate blood.{' '}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs pl-6">{errors.agreeTerms}</p>
              )}
              <label className="flex items-start gap-3 cursor-pointer text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={form.agreeContact}
                  onChange={(e) => set('agreeContact', e.target.checked)}
                  className="mt-1 accent-red-600"
                />
                <span className="text-sm">
                  I allow Nanbargal Blood Foundation to share my contact details with blood seekers in emergencies.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 text-base py-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <><FaTint /> Register as Blood Donor</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}