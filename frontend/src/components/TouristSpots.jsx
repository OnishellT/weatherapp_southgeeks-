import React from "react";

const TouristSpots = ({ places, onClear, loadingPlaces }) => {
  if (loadingPlaces) {
    return (
      <div className="flex justify-center items-center py-6">
        <span
          role="status"
          aria-label="Loading places"
          className="loading loading-lg loading-spinner text-primary"
        ></span>
      </div>
    );
  }

  if (!places) return null;

  return (
    <div className="card bg-base-100 shadow-xl mt-8 border border-base-200 hover:shadow-2xl transition-all duration-300">
      <div className="card-body relative">
        <button
          onClick={onClear}
          className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4"
        >
          ✕
        </button>
        <h3 className="card-title text-2xl">Tourist Spots Nearby</h3>
        <ul className="space-y-3 mt-2">
          {places.map((place, index) => (
            <li
              key={index}
              className="p-3 rounded-lg bg-base-200 hover:bg-base-300 transition"
            >
              <p className="font-semibold">{place.name}</p>
              <p className="text-sm opacity-70">{place.address}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TouristSpots;