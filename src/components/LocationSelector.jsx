import { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

export default function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);

    const stateData = State.getStatesOfCountry(countryCode);
    setStates(stateData);

    setCities([]);
    setSelectedState("");
  };

  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);

    const cityData = City.getCitiesOfState(
      selectedCountry,
      stateCode
    );

    setCities(cityData);
  };

  return (
    <div className="space-y-4">
      {/* Country */}
      <select
        className="border p-2 rounded w-full"
        onChange={(e) => handleCountryChange(e.target.value)}
      >
        <option>Select Country</option>

        {countries.map((country) => (
          <option
            key={country.isoCode}
            value={country.isoCode}
          >
            {country.name}
          </option>
        ))}
      </select>

      {/* State */}
      <select
        className="border p-2 rounded w-full"
        onChange={(e) => handleStateChange(e.target.value)}
      >
        <option>Select State</option>

        {states.map((state) => (
          <option
            key={state.isoCode}
            value={state.isoCode}
          >
            {state.name}
          </option>
        ))}
      </select>

      {/* City */}
      <select
        className="border p-2 rounded w-full"
      >
        <option>Select City</option>

        {cities.map((city, index) => (
          <option key={index}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}