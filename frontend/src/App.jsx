import React, { useState, useEffect, useRef } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import Map from './components/Map';
import WeatherInfo from './components/WeatherInfo';
import TouristSpots from './components/TouristSpots';
import { getUsers, createUser, updateUser, deleteUser, getWeather, getPlaces } from './services/api';

function App() {
  const [users, setUsers] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [places, setPlaces] = useState(null);
  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    fetchUsers({ showLoading: true });
    const intervalId = setInterval(() => {
      fetchUsers({ showLoading: false });
    }, 1500);
    return () => clearInterval(intervalId);
  }, []);

  const deepEqual = (a, b) => {
    try {
      const stable = (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(stable);
        return Object.keys(obj)
          .sort()
          .reduce((acc, key) => {
            acc[key] = stable(obj[key]);
            return acc;
          }, {});
      };
      return JSON.stringify(stable(a)) === JSON.stringify(stable(b));
    } catch (_) {
      return false;
    }
  };

  const fetchUsers = async ({ showLoading } = { showLoading: false }) => {
    const requestId = ++latestRequestIdRef.current;
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const next = await getUsers();
      if (requestId !== latestRequestIdRef.current) return;
      setUsers((prev) => (deepEqual(prev, next) ? prev : next));
    } catch (err) {
      if (requestId !== latestRequestIdRef.current) return;
      setError(err.message);
    } finally {
      if (showLoading && requestId === latestRequestIdRef.current) setLoading(false);
    }
  };

  const handleCreateUser = async (user) => {
    try {
      setError(null);
      await createUser(user);
      fetchUsers({ showLoading: false });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateUser = async (user) => {
    try {
      setError(null);
      await updateUser(editingUser.id, user);
      fetchUsers({ showLoading: false });
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      setError(null);
      await deleteUser(id);
      fetchUsers({ showLoading: false });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSubmit = (formData) => {
    if (editingUser) {
      handleUpdateUser(formData);
    } else {
      handleCreateUser(formData);
    }
  };

  const handleMarkerClick = async (user) => {
    try {
      setError(null);
      setWeather(null);
      setPlaces(null);
      setSelectedUser(user);
      setLoadingWeather(true);
      const weatherData = await getWeather(user.latitude, user.longitude);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleClearWeather = () => {
    setSelectedUser(null);
    setWeather(null);
  };

  const handleShowPlaces = async (user) => {
    try {
      setError(null);
      setWeather(null);
      setPlaces(null);
      setSelectedUser(user);
      setLoadingPlaces(true);
      const placesData = await getPlaces(user.latitude, user.longitude);
      setPlaces(placesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const handleClearPlaces = () => {
    setSelectedUser(null);
    setPlaces(null);
  };

  return (
    <div data-theme="cupcake" className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg mb-6">
        <div className="navbar-center">
          <a className="btn btn-ghost normal-case text-2xl font-bold">SouthGeeks Weather APP</a>
        </div>
      </div>

      {/* Main Layout */}
      <main className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <UserForm
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            initialData={editingUser}
          />

          {error && (
            <div role="alert" className="alert alert-error shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-6">
              <span role="status" aria-label="Loading users" className="loading loading-lg loading-spinner text-primary"></span>
            </div>
          ) : (
            <UserList
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onShowWeather={handleMarkerClick}
              onShowPlaces={handleShowPlaces}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <Map users={users} onMarkerClick={handleMarkerClick} />
            </div>
          </div>

          {selectedUser && loadingWeather && (
            <div className="flex justify-center items-center py-6">
              <span role="status" aria-label="Loading weather" className="loading loading-lg loading-spinner text-primary"></span>
            </div>
          )}

          {selectedUser && weather && !loadingWeather && (
            <WeatherInfo
              weather={weather}
              user={selectedUser}
              onClear={handleClearWeather}
            />
          )}

          {selectedUser && loadingPlaces && (
            <div className="flex justify-center items-center py-6">
              <span role="status" aria-label="Loading places" className="loading loading-lg loading-spinner text-primary"></span>
            </div>
          )}

          {selectedUser && places && !loadingPlaces && (
            <TouristSpots
              places={places}
              user={selectedUser}
              onClear={handleClearPlaces}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;