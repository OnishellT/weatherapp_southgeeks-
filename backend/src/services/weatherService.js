const tzLookup = require("tz-lookup");
const https = require('https');
const keepAliveAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });
const fetch = require('node-fetch');
const { getParameter } = require('../utils/ssm');

let cachedOwmKey;
const getApiKey = async () => {
    if (cachedOwmKey) return cachedOwmKey;
    if (process.env.OPENWEATHERMAP_API_KEY) {
        cachedOwmKey = process.env.OPENWEATHERMAP_API_KEY;
        return cachedOwmKey;
    }
    if (process.env.OPENWEATHERMAP_API_KEY_NAME) {
        cachedOwmKey = await getParameter(process.env.OPENWEATHERMAP_API_KEY_NAME);
        return cachedOwmKey;
    }
    throw new Error("OpenWeatherMap API Key not configured");
}

const geoCache = new Map(); 
const GEO_TTL_MS = 15 * 60 * 1000; 

const getGeoData = async (zip) => {
  try {
    const apiKey = await getApiKey();
    const cached = geoCache.get(zip);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apiKey}`;
    
    console.log(`Fetching geodata for zip: ${zip}`); // Debug log

    const response = await fetch(url, { agent: keepAliveAgent });
    if (response.status === 404) {
      console.warn(`Zip code not found: ${zip}`);
      return null;
    }

    if (!response.ok) {
      console.error("OpenWeatherMap API Error:", response.statusText);
      throw new Error("Failed to fetch geodata.");
    }

    const data = await response.json();
    console.log("Geodata received:", data); // Debug log

    const timezone = tzLookup(data.coord.lat, data.coord.lon);

    const result = {
      latitude: data.coord.lat,
      longitude: data.coord.lon,
      timezone: timezone,
    };
    geoCache.set(zip, { data: result, expiresAt: now + GEO_TTL_MS });
    return result;
  } catch (error) {
    console.error("Error in getGeoData:", error);
    throw error;
  }
};

const getCurrentWeather = async (lat, lon) => {
  try {
    const apiKey = await getApiKey();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    const response = await fetch(url, { agent: keepAliveAgent });
    if (!response.ok) {
      console.error("OpenWeatherMap API Error:", response.statusText);
      throw new Error("Failed to fetch weather data.");
    }
    return response.json();
  } catch (error) {
    console.error("Error in getCurrentWeather:", error);
    throw error;
  }
};

module.exports = {
  getGeoData,
  getCurrentWeather,
};