const { initializeFirebase, getDB, getUsersRef } = require("../services/firebaseService");
const { ref, set, get, child, update, remove } = require("firebase/database");
const { getGeoData } = require("../services/weatherService");
const { validateUser } = require("../utils/validation");
const { v4: uuidv4 } = require('uuid');

function parseBody(event) {
  if (!event || event.body == null) return {};
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    return {};
  }
}

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

exports.createUser = async (event) => {
  try {
    await initializeFirebase();
    const { name, zip } = parseBody(event);
    const normalizedName = name !== undefined && name !== null ? String(name).trim() : "";
    const normalizedZip = zip !== undefined && zip !== null ? String(zip).trim() : "";

    const validationErrors = validateUser({ name: normalizedName, zip: normalizedZip });
    if (validationErrors.length > 0) {
      return json(400, { errors: validationErrors });
    }

    const zipForGeo = normalizedZip.split('-')[0];
    const geoData = await getGeoData(zipForGeo);
    if (!geoData) {
      return json(400, { error: "Zip code not found on OpenWeatherMap API." });
    }

    const newUser = {
      id: uuidv4(),
      name: normalizedName,
      zip: normalizedZip,
      ...geoData,
    };

    await set(child(ref(getDB(), 'users'), newUser.id), newUser);
    return json(201, newUser);
  } catch (error) {
    console.error('createUser error:', error);
    return json(500, { error: 'Failed to create user.', details: error.message });
  }
};

exports.listUsers = async () => {
  try {
    await initializeFirebase();
    const snapshot = await get(getUsersRef());
    const users = snapshot.val();
    return json(200, users || {});
  } catch (error) {
    console.error('listUsers error:', error);
    return json(500, { error: 'Failed to fetch users.' });
  }
};

exports.getUserById = async (event) => {
  try {
    await initializeFirebase();
    const { id } = event.pathParameters || {};
    const snapshot = await get(child(getUsersRef(), id));
    const user = snapshot.val();
    if (!user) {
      return json(404, { error: 'User not found.' });
    }
    return json(200, user);
  } catch (error) {
    console.error('getUserById error:', error);
    return json(500, { error: 'Failed to fetch user.' });
  }
};

exports.updateUser = async (event) => {
  try {
    await initializeFirebase();
    const { id } = event.pathParameters || {};
    const { name, zip } = parseBody(event);
    const normalizedName = name !== undefined && name !== null ? String(name).trim() : undefined;
    const normalizedZip = zip !== undefined && zip !== null ? String(zip).trim() : undefined;

    const snapshot = await get(child(getUsersRef(), id));
    const existingUser = snapshot.val();
    if (!existingUser) {
      return json(404, { error: 'User not found.' });
    }

    const updatedData = {
      name: normalizedName || existingUser.name,
      zip: normalizedZip || existingUser.zip,
    };

    if (normalizedZip && normalizedZip !== existingUser.zip) {
      const zipForGeo = normalizedZip.split('-')[0];
      const geoData = await getGeoData(zipForGeo);
      if (!geoData) {
        return json(400, { error: 'Zip code not found on OpenWeatherMap API.' });
      }
      updatedData.latitude = geoData.latitude;
      updatedData.longitude = geoData.longitude;
      updatedData.timezone = geoData.timezone;
    }

    await update(child(getUsersRef(), id), updatedData);
    const updatedSnapshot = await get(child(getUsersRef(), id));
    return json(200, updatedSnapshot.val());
  } catch (error) {
    console.error('updateUser error:', error);
    return json(500, { error: 'Failed to update user.' });
  }
};

exports.deleteUser = async (event) => {
  try {
    await initializeFirebase();
    const { id } = event.pathParameters || {};
    await remove(child(getUsersRef(), id));
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      },
      body: ''
    };
  } catch (error) {
    console.error('deleteUser error:', error);
    return json(500, { error: 'Failed to delete user.' });
  }
};


