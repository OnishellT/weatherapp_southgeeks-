const fetch = require("node-fetch");
const https = require('https');
const keepAliveAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });
const { getParameter } = require('../utils/ssm');
// Basic in-memory cache to reduce Geoapify latency per warm container
const placesCache = new Map(); // key: `${lat},${lon}`, value: { data, expiresAt }
const PLACES_TTL_MS = 5 * 60 * 1000; // 5 minutes

const getTouristPlaces = async (lat, lon) => {
  try {
    let geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
    if (!geoapifyApiKey && process.env.GEOAPIFY_API_KEY_NAME) {
      geoapifyApiKey = await getParameter(process.env.GEOAPIFY_API_KEY_NAME);
    }
    if (!geoapifyApiKey) throw new Error('GEOAPIFY_API_KEY not configured');
    const key = `${lat},${lon}`;
    const now = Date.now();
    const cached = placesCache.get(key);
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }
    const url = `https://api.geoapify.com/v2/places?categories=tourism.attraction&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=5&apiKey=${geoapifyApiKey}`;

    const response = await fetch(url, { agent: keepAliveAgent });
    if (!response.ok) {
      console.error("Geoapify API Error:", response.statusText);
      throw new Error("Failed to fetch tourist places.");
    }
    const data = await response.json();
    const result = data.features.map(feature => ({
      name: feature.properties.name,
      address: feature.properties.address_line2,
    }));
    placesCache.set(key, { data: result, expiresAt: now + PLACES_TTL_MS });
    return result;
  } catch (error) {
    console.error("Error in getTouristPlaces:", error);
    throw error;
  }
};

module.exports = {
  getTouristPlaces,
};