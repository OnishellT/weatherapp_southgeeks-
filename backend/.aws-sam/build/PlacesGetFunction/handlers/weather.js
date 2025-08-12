const { getCurrentWeather } = require("../services/weatherService");

function json(statusCode, data) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(data)
  };
}

exports.getWeather = async (event) => {
  try {
    const query = event.queryStringParameters || {};
    const { lat, lon } = query;
    if (!lat || !lon) {
      return json(400, { error: "Latitude and longitude are required." });
    }
    const weatherData = await getCurrentWeather(lat, lon);
    return json(200, weatherData);
  } catch (error) {
    console.error('getWeather error:', error);
    return json(500, { error: "Failed to fetch weather data." });
  }
};


