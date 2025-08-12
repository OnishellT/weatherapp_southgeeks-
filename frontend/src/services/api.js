const API_BASE_URL = 'https://rcm63ezz51.execute-api.us-east-1.amazonaws.com/Prod/api';
export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = Array.isArray(errorData.errors)
      ? errorData.errors.join(', ')
      : (errorData.error || 'Failed to fetch users.');
    throw new Error(message);
  }
  return response.json();
};

export const createUser = async (user) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  console.log("Create User Request Body:", JSON.stringify(user));
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = Array.isArray(errorData.errors)
      ? errorData.errors.join(', ')
      : (errorData.error || 'Failed to create user.');
    throw new Error(message);
  }
  return response.json();
};

export const updateUser = async (id, user) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  console.log("Update User Request Body:", JSON.stringify(user));
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = Array.isArray(errorData.errors)
      ? errorData.errors.join(', ')
      : (errorData.error || 'Failed to update user.');
    throw new Error(message);
  }
  return response.json();
};

export const getPlaces = async (lat, lon) => {
  const response = await fetch(`${API_BASE_URL}/places?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = Array.isArray(errorData.errors)
      ? errorData.errors.join(', ')
      : (errorData.error || 'Failed to fetch places.');
    throw new Error(message);
  }
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete user.");
  }
};

export const getWeather = async (lat, lon) => {
  const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = Array.isArray(errorData.errors)
      ? errorData.errors.join(', ')
      : (errorData.error || 'Failed to fetch weather.');
    throw new Error(message);
  }
  return response.json();
};