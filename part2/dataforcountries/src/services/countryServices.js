import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getAll = () => {
    const request = axios.get(`${baseUrl}/all`);
    return request.then((response) => response.data);
  };

const getCountryByName = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`);
  return request.then((response) => response.data);
}

const getWether = (lat, long) => {
    const api_key = import.meta.env.VITE_WEATHER_API_KEY
    const request = axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}&units=metric`);
    return request.then((response) => response.data);
}

export default { getAll, getCountryByName, getWether };
