import React from "react";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";

const WeatherInfo = ({ weather, user, onClear }) => {
  if (!weather || !user) return null;

  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300)
      return <WiThunderstorm size={64} className="text-primary" />;
    if (weatherId >= 300 && weatherId < 600)
      return <WiRain size={64} className="text-info" />;
    if (weatherId >= 600 && weatherId < 700)
      return <WiSnow size={64} className="text-blue-300" />;
    if (weatherId >= 801 && weatherId < 805)
      return <WiCloudy size={64} className="text-gray-400" />;
    return <WiDaySunny size={64} className="text-yellow-400" />;
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 mt-4">
      <div className="card-body relative">
        <button
          onClick={onClear}
          className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4"
        >
          ✕
        </button>
        <h3 className="card-title">{user.name}'s Weather</h3>
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather.weather[0].id)}
          <div>
            <p className="capitalize">{weather.weather[0].description}</p>
            <p className="text-2xl font-bold">
              {Math.round(weather.main.temp)}°F
            </p>
          </div>
        </div>
        <p className="opacity-70">{weather.name}</p>
      </div>
    </div>
  );
};

export default WeatherInfo;