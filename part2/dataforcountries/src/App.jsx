import { useState, useEffect } from "react";
import countryServices from "./services/countryServices";

function App() {
  const [filterText, setFilterText] = useState(null);
  const [displayElement, setDisplayElement] = useState(null);
  const [countriesList, setCountriesList] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  console.log("render");

  useEffect(() => {
    console.log("effect");
    countryServices.getAll().then((countries) => {
      setCountriesList(countries);
    });
  }, []);

  const handleShowClick = (country) => {
    setSelectedCountry(country)
    countryServices
      .getWether(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
      .then((weather) => {
        setWeatherData(weather);
      });
  }

  const handleQueryChange = (value) => {
    if (value === "") {
      setDisplayElement(null);
      setFilterText("");
      return;
    }
    const filteredList = countriesList.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );
    if (filteredList.length > 10) {
      setSelectedCountry(null);
      setWeatherData(null)
      setDisplayElement(["Too many matches, specify another filter"]);
    } else if (filteredList.length > 1) {
      setSelectedCountry(null);
      setWeatherData(null)
      setDisplayElement(
        filteredList.map((country) => (
          <li key={country.cca2}>
            {country.name.common}
            <button onClick={() => handleShowClick(country)}>show</button>
          </li>
        ))
      );
    } else if (filteredList.length === 1) {
      const countryName = filteredList[0].name.common;
      countryServices.getCountryByName(countryName).then((country) => {
        setSelectedCountry(country);
        setDisplayElement(null);
        countryServices
        .getWether(filteredList[0].capitalInfo.latlng[0], filteredList[0].capitalInfo.latlng[1])
        .then((weather) => {
           setWeatherData(weather);
        });
      });
    } else if (filteredList.length === 0) {
      setSelectedCountry(null);
      setWeatherData(null)
      setDisplayElement(["No matches found"]);
    }
    setFilterText(value);
  };

  const SelectedCountryDisplay = () => {
    return (
      <div>
        <h1>{selectedCountry.name.common}</h1>
        <p>capital: {selectedCountry.capital}</p>
        <p>area: {selectedCountry.area}</p>
        <h2>languages</h2>
        <ul>
          {Object.values(selectedCountry.languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
        <img
          src={selectedCountry.flags.png}
          alt={`flag of ${selectedCountry.name.common}`}
          width='100'
        />
        {weatherData ? (
          <div>
            <h2>Weather in {selectedCountry.capital}</h2>
            <p>temperature: {weatherData.main.temp}°C</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <p>
              wind: {weatherData.wind.speed} m/s direction{" "}
              {weatherData.wind.deg}°
            </p>
          </div>
        ) : null}
      </div>
    );
  };

  if (!countriesList || countriesList.length === 0) {
    return null;
  }

  return (
    <>
      <div>
        find countries
        <input
          type='text'
          value={filterText ? filterText : ""}
          onChange={(e) => handleQueryChange(e.target.value)}
        />
      </div>
      {displayElement ? (
        <ul style={{ listStyleType: "none" }}>{displayElement}</ul>
      ) : null}
      {selectedCountry ? <SelectedCountryDisplay /> : null}
    </>
  );
}

export default App;


