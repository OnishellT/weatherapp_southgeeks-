import React, { useState, useEffect } from "react";

const UserForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({ name: "", zip: "" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        zip: initialData.zip,
      });
    } else {
      setFormData({ name: "", zip: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", zip: "" });
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body">
        <h2 className="card-title">
          {initialData ? "Edit User" : "Create User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Zip Code</span>
            </label>
            <input
              type="text"
              placeholder="Zip Code"
              className="input input-bordered"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
            />
          </div>
          <div className="card-actions justify-end">
            {initialData && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;