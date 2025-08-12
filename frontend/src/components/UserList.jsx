import React from "react";
import UserListItem from "./UserListItem";

const UserList = ({ users, onEdit, onDelete, onShowWeather, onShowPlaces }) => {
  const userArray = Object.values(users || {});

  return (
    <div className="mt-6 space-y-4">
      {userArray.length > 0 ? (
        userArray.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            onShowWeather={onShowWeather}
            onShowPlaces={onShowPlaces}
          />
        ))
      ) : (
        <div className="alert alert-info shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>No users found. Create one to get started!</span>
        </div>
      )}
    </div>
  );
};

export default UserList;