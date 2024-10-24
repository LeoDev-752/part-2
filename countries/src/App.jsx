import React, { useState, useEffect } from 'react'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const capital = country.capital ? country.capital[0] : "N/A"

  useEffect(() => {
    if (capital !== "N/A") {
      const apiKey = import.meta.env.VITE_REACT_APP_OPENWEATHER_API_KEY
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`

      fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
          setWeather(data)
        })
        .catch(err => console.error('Error fetching weather data:', err))
    }
  }, [capital])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {capital}</p>
      <p>Area: {country.area} km²</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />

      {weather && (
        <div>
          <h3>Weather in {capital}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            width="100"
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(err => console.error('Error fetching countries:', err))
  }, [])

  useEffect(() => {
    if (search) {
      const results = countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredCountries(results)
    } else {
      setFilteredCountries([])
    }
  }, [search, countries])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowDetails = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <h1>Search for a Country</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Enter country name"
      />
      {filteredCountries.length > 10 && <p>Too many matches, specify another filter</p>}
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleShowDetails(country)}>Show Details</button>
            </li>
          ))}
        </ul>
      )}
      {filteredCountries.length === 1 && <CountryDetails country={filteredCountries[0]} />}
      {selectedCountry && <CountryDetails country={selectedCountry} />}
    </div>
  )
}

export default App
