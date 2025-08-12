import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = ({ users, onMarkerClick }) => {
  return (
    <div className="card bg-base-100 shadow-xl mt-6 border border-base-200 overflow-hidden">
      <div className="card-body p-0 h-[400px]">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {Object.values(users).map(
            (user) =>
              user.latitude &&
              user.longitude && (
                <Marker
                  key={user.id}
                  position={[user.latitude, user.longitude]}
                  eventHandlers={{
                    click: () => onMarkerClick(user),
                  }}
                >
                  <Popup>
                    <span className="font-bold">{user.name}</span>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;