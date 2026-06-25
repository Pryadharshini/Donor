import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import { FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { FaTint } from 'react-icons/fa';
import { BLOOD_GROUPS, DONORS } from '../data/dummy';
import DonorCard from '../components/DonorCard';
import { DonorCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

const PER_PAGE = 6;

export default function FindDonor() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get('bloodGroup') || '',
    countryCode: 'IN',
    stateCode: '',
    city: searchParams.get('city') || '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  // Derived lists from country-state-city
  const allCountries = useMemo(() => Country.getAllCountries(), []);

  const states = useMemo(
    () => (filters.countryCode ? State.getStatesOfCountry(filters.countryCode) : []),
    [filters.countryCode]
  );

  const cities = useMemo(
    () =>
      filters.countryCode && filters.stateCode
        ? City.getCitiesOfState(filters.countryCode, filters.stateCode)
        : [],
    [filters.countryCode, filters.stateCode]
  );

  // Resolve human-readable names for filtering against DONORS data
  const selectedStateName = useMemo(
    () => states.find((s) => s.isoCode === filters.stateCode)?.name || '',
    [states, filters.stateCode]
  );

  const handleSearch = () => {
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      const filtered = DONORS.filter((d) => {
        if (filters.bloodGroup && d.bloodGroup !== filters.bloodGroup) return false;
        if (selectedStateName && d.state !== selectedStateName) return false;
        if (filters.city && !d.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
        return true;
      });
      setResults(filtered);
      setPage(1);
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setFilters({ bloodGroup: '', countryCode: 'IN', stateCode: '', city: '' });
    setResults([]);
    setSearched(false);
  };

  const handleCountryChange = (e) => {
    setFilters((p) => ({ ...p, countryCode: e.target.value, stateCode: '', city: '' }));
  };

  const handleStateChange = (e) => {
    setFilters((p) => ({ ...p, stateCode: e.target.value, city: '' }));
  };

  useEffect(() => {
    if (searchParams.get('bloodGroup') || searchParams.get('state')) handleSearch();
  }, []);

  const paged = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Find Blood Donors</h1>
          <p className="text-red-200 text-lg">Search from {DONORS.length}+ registered donors across India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filter Panel */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiFilter size={18} className="text-red-500" /> Search Filters
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showFilters ? 'Hide' : 'Show'}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Blood Group */}
              <div>
                <label className="label">Blood Group</label>
                <select
                  value={filters.bloodGroup}
                  onChange={(e) => setFilters((p) => ({ ...p, bloodGroup: e.target.value }))}
                  className="input-field"
                >
                  <option value="">All Groups</option>
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="label">Country</label>
                <select
                  value={filters.countryCode}
                  onChange={handleCountryChange}
                  className="input-field"
                >
                  <option value="">All Countries</option>
                  {allCountries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="label">State / Province</label>
                <select
                  value={filters.stateCode}
                  onChange={handleStateChange}
                  className="input-field"
                  disabled={!filters.countryCode}
                >
                  <option value="">All States</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* City — dropdown if library has cities, else free text */}
              <div>
                <label className="label">City</label>
                {cities.length > 0 ? (
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                    className="input-field"
                    disabled={!filters.stateCode}
                  >
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={filters.city}
                    onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Enter city..."
                    className="input-field"
                  />
                )}
              </div>
            </div>
          )}

          {showFilters && (
            <div className="flex gap-3 mt-5">
              <button onClick={handleSearch} className="btn-primary flex items-center gap-2">
                <FiSearch /> Search Donors
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
              >
                <FiRefreshCw size={16} /> Reset
              </button>
            </div>
          )}
        </div>

        {/* Blood Group Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-gray-500 dark:text-gray-400 self-center mr-1">Quick filter:</span>
          {BLOOD_GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setFilters((p) => ({ ...p, bloodGroup: g }))}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                filters.bloodGroup === g
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 hover:text-red-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <DonorCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <EmptyState
            icon={FaTint}
            title="No donors found"
            subtitle="Try searching with different filters or a different blood group."
          />
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{paged.length}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{results.length}</span> donors
              </p>
              <p className="text-xs text-gray-400">{results.filter((d) => d.available).length} available now</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((donor) => <DonorCard key={donor.id} donor={donor} />)}
            </div>
            <Pagination current={page} total={results.length / PER_PAGE} onChange={setPage} />
          </>
        )}

        {!searched && (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
              <FiSearch size={40} className="text-red-300 dark:text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Search for Donors</h3>
            <p className="text-gray-500 dark:text-gray-400">Use the filters above to find blood donors in your area</p>
          </div>
        )}
      </div>
    </div>
  );
}