import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import { FaDroplet, FaHeartPulse } from 'react-icons/fa6';
import { FiArrowRight, FiSearch, FiUsers, FiHeart, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { FaTint, FaHandHoldingHeart, FaAward, FaCity } from 'react-icons/fa';
import { BLOOD_GROUPS, STATS, TESTIMONIALS } from '../data/dummy';

function StatCard({ icon: Icon, value, label, color = 'red' }) {
  const colors = { red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400', blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' };
  return (
    <div className="card p-6 text-center hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-2xl ${colors[color]} flex items-center justify-center mx-auto mb-3`}>
        <Icon size={26} />
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export default function Home() {
  const [searchForm, setSearchForm] = useState({
    bloodGroup: '',
    countryCode: '',   // e.g. "IN"
    stateCode: '',     // e.g. "TN"
    city: '',
    taluk: '',
  });
  const navigate = useNavigate();

  // All countries, sorted by name
  const allCountries = useMemo(() => Country.getAllCountries(), []);

  // States for the selected country
  const states = useMemo(
    () => (searchForm.countryCode ? State.getStatesOfCountry(searchForm.countryCode) : []),
    [searchForm.countryCode]
  );

  // Cities for the selected country + state
  const cities = useMemo(
    () =>
      searchForm.countryCode && searchForm.stateCode
        ? City.getCitiesOfState(searchForm.countryCode, searchForm.stateCode)
        : [],
    [searchForm.countryCode, searchForm.stateCode]
  );

  const countryOptions = useMemo(() => allCountries.map(c => ({ value: c.isoCode, label: `${c.flag} ${c.name}` })), [allCountries]);
  const stateOptions = useMemo(() => states.map(s => ({ value: s.isoCode, label: s.name })), [states]);
  const cityOptions = useMemo(() => cities.map(c => ({ value: c.name, label: c.name })), [cities]);

  // Custom styles for react-select to match the translucent dark theme of the hero card
  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      padding: '4px',
      borderRadius: '0.75rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: 'white',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.4)',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#1f2937', // dark-800
      zIndex: 50
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#374151' : 'transparent',
      color: 'white',
      '&:active': {
        backgroundColor: '#4b5563',
      }
    }),
    input: (base) => ({
      ...base,
      color: 'white',
    })
  };

  const handleCountryChange = (e) => {
    setSearchForm((p) => ({ ...p, countryCode: e.target.value, stateCode: '', city: '', taluk: '' }));
  };

  const handleStateChange = (e) => {
    setSearchForm((p) => ({ ...p, stateCode: e.target.value, city: '', taluk: '' }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Resolve human-readable names for the query string
    const countryName = allCountries.find((c) => c.isoCode === searchForm.countryCode)?.name || '';
    const stateName = states.find((s) => s.isoCode === searchForm.stateCode)?.name || '';
    const params = new URLSearchParams();
    if (searchForm.bloodGroup) params.append('bloodGroup', searchForm.bloodGroup);
    if (countryName) params.append('country', countryName);
    if (stateName) params.append('state', stateName);
    if (searchForm.city) params.append('city', searchForm.city);
    if (searchForm.taluk) params.append('taluk', searchForm.taluk);
    navigate(`/find-donor?${params}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-hero min-h-screen flex items-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-900/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
                <FaHeartPulse className="text-red-300 animate-pulse" />
                <span>Every drop saves a life</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Be a Hero.<br />
                <span className="text-red-200">Donate Blood.</span><br />
                Save Lives.
              </h1>
              <p className="text-red-100/80 text-lg mb-8 max-w-lg leading-relaxed">
                Join thousands of donors across India. Your one blood donation can save up to three lives. Be the reason someone gets to go home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register-donor" className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-7 py-4 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                  <FaTint /> Become a Donor
                </Link>
                <Link to="/blood-request" className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-4 rounded-xl hover:bg-white/10 transition-all duration-200">
                  Request Blood <FiArrowRight size={18} />
                </Link>
              </div>

              {/* Tamil motto */}
              <div className="mt-10 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/20" />
                <p className="text-white/60 text-sm font-medium px-3">இரத்தம் கொடுங்கள் • உயிர் காப்போம்</p>
                <div className="h-px flex-1 bg-white/20" />
              </div>
            </div>

            {/* Search Card */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <FiSearch size={20} /> Find a Blood Donor
              </h2>
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Blood Group */}
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">Blood Group</label>
                  <select
                    value={searchForm.bloodGroup}
                    onChange={(e) => setSearchForm((p) => ({ ...p, bloodGroup: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
                  >
                    <option value="" className="text-gray-900">All Blood Groups</option>
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g} className="text-gray-900">{g}</option>
                    ))}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">Country</label>
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(opt => opt.value === searchForm.countryCode) || null}
                    onChange={(selected) => setSearchForm(p => ({ ...p, countryCode: selected ? selected.value : '', stateCode: '', city: '' }))}
                    placeholder="Search country..."
                    styles={selectStyles}
                    isClearable
                  />
                </div>

                {/* State — shown only when a country is selected */}
                {searchForm.countryCode && (
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">State / Province</label>
                    <Select
                      options={stateOptions}
                      value={stateOptions.find(opt => opt.value === searchForm.stateCode) || null}
                      onChange={(selected) => setSearchForm(p => ({ ...p, stateCode: selected ? selected.value : '', city: '' }))}
                      placeholder="Search state..."
                      styles={selectStyles}
                      isClearable
                    />
                  </div>
                )}

                {/* City — shown only when a state is selected */}
                {searchForm.stateCode && (
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">City</label>
                    {cities.length > 0 ? (
                      <Select
                        options={cityOptions}
                        value={cityOptions.find(opt => opt.value === searchForm.city) || null}
                        onChange={(selected) => setSearchForm(p => ({ ...p, city: selected ? selected.value : '', taluk: '' }))}
                        placeholder="Search city..."
                        styles={selectStyles}
                        isClearable
                      />
                    ) : (
                      <input
                        value={searchForm.city}
                        onChange={(e) => setSearchForm((p) => ({ ...p, city: e.target.value, taluk: '' }))}
                        placeholder="Enter city name"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-all"
                      />
                    )}
                  </div>
                )}

                {/* Taluk */}
                {searchForm.city && (
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1.5">Taluk</label>
                    <input
                      value={searchForm.taluk}
                      onChange={(e) => setSearchForm((p) => ({ ...p, taluk: e.target.value }))}
                      placeholder="Enter taluk name..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-all"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-white text-red-600 font-bold py-3.5 rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <FiSearch /> Search Donors
                </button>
              </form>

              {/* Blood Group Quick Select */}
              <div className="mt-5">
                <p className="text-white/50 text-xs mb-3">Quick search by blood group:</p>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((g) => (
                    <button
                      key={g}
                      onClick={() => navigate(`/find-donor?bloodGroup=${g}`)}
                      className="text-center py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 hover:border-white/30 transition-all"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}


      {/* How It Works */}
      <section className="py-16 bg-red-50 dark:bg-red-950/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple steps to save a life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: FiUsers, title: 'Register as a Donor', desc: 'Fill out your profile with blood group, location, and contact details. It takes less than 2 minutes.' },
              { step: '2', icon: FiSearch, title: 'Get Matched', desc: 'Our system instantly matches blood requests with eligible donors in the same area.' },
              { step: '3', icon: FaHandHoldingHeart, title: 'Donate & Save Lives', desc: 'Visit the hospital, donate blood, and receive a hero\'s gratitude. Track your donations.' },
            ].map((item) => (
              <div key={item.step} className="card p-8 text-center hover:shadow-md transition-all duration-200 hover:-translate-y-1 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-5 mt-2">
                  <item.icon size={28} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-10 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-900/30 rounded-full blur-2xl" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm mb-4">
              <FiAlertCircle className="animate-pulse" /> Emergency? We're here 24/7
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Need Blood Urgently?</h2>
            <p className="text-red-100/80 text-lg mb-8 max-w-xl mx-auto">Submit an emergency blood request and we'll connect you with the nearest available donors within minutes.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/blood-request" className="bg-white text-red-600 font-bold px-8 py-4 rounded-xl hover:bg-red-50 transition-all shadow-xl hover:-translate-y-0.5">
                Submit Emergency Request
              </Link>
              <a href="tel:1800-BLOOD" className="border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                Call Helpline Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Donate Blood?</h2>
            <p className="section-subtitle">Every donation makes a lasting impact</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🩸', title: 'Save Up To 3 Lives', desc: 'One whole blood donation can be separated into red cells, platelets, and plasma — each saving a different life.' },
              { icon: '⏱️', title: 'Takes Only 30 Minutes', desc: 'The donation process including registration and recovery takes less than an hour of your day.' },
              { icon: '💪', title: 'Health Benefits', desc: 'Regular donors have reduced risk of heart disease and get free health screenings with every donation.' },
              { icon: '🔄', title: 'Replenishes in 56 Days', desc: 'Your body naturally replaces donated blood within 4-8 weeks, so you can donate every 3 months.' },
              { icon: '🏥', title: 'Always in Demand', desc: 'Every 2 seconds someone in India needs blood. Cancer, surgeries, accidents — the need never stops.' },
              { icon: '🤝', title: 'Community Impact', desc: 'Be part of a life-saving community. Inspire others and create a culture of giving in your city.' },
            ].map((item) => (
              <div key={item.title} className="card p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex gap-4">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto text-center">
          <FaTint className="text-red-500 text-5xl mx-auto mb-5 animate-bounce-slow" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Save a Life?</h2>
          <p className="text-gray-400 text-lg mb-8">Join 12,000+ donors who have pledged to give blood regularly. Your next donation could be someone's second chance at life.</p>
          <Link to="/register-donor" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-xl hover:shadow-red-900/50 hover:-translate-y-0.5">
            Register as a Donor <FiArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}