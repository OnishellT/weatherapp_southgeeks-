const { getTouristPlaces } = require("../services/placesService");

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

exports.getPlaces = async (event) => {
  try {
    const query = event.queryStringParameters || {};
    const { lat, lon } = query;
    if (!lat || !lon) {
      return json(400, { error: "Latitude and longitude are required." });
    }
    const places = await getTouristPlaces(lat, lon);
    return json(200, places);
  } catch (error) {
    console.error('getPlaces error:', error);
    return json(500, { error: "Failed to fetch tourist places." });
  }
};


