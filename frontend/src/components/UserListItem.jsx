import React from "react";

const UserListItem = ({ user, onEdit, onDelete, onShowWeather, onShowPlaces }) => {
  return (
    <div className="card bg-base-100 shadow-md border border-base-200 hover:shadow-xl transition mb-4">
      <div className="card-body">
        <h2 className="card-title">
          {user.name}
          <div className="badge badge-neutral ml-2">{user.zip}</div>
        </h2>
        <p className="opacity-70">
          {user.latitude.toFixed(2)}, {user.longitude.toFixed(2)}
        </p>
        <div className="card-actions justify-end flex-wrap gap-2">
          {onShowWeather && (
            <button
              onClick={() => onShowWeather(user)}
              className="btn btn-sm btn-info"
            >
              Weather
            </button>
          )}
          {onShowPlaces && (
            <button
              onClick={() => onShowPlaces(user)}
              className="btn btn-sm btn-success"
            >
              Places
            </button>
          )}
          <button
            onClick={() => onEdit(user)}
            className="btn btn-sm btn-warning"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="btn btn-sm btn-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;