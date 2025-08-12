import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import App from '../App';
import 'whatwg-fetch';

// Mock API services
jest.mock('../services/api', () => ({
  getUsers: jest.fn().mockResolvedValue([]),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getWeather: jest.fn(),
  getPlaces: jest.fn(),
}));

describe('App Component', () => {
  test('renders user dashboard title', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
  });

  test('renders create user form fields', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText(/Create User/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Zip Code/i)).toBeInTheDocument();
  });

  test('shows empty state when no users', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(
      screen.getByText(/No users found. Create one to get started!/i)
    ).toBeInTheDocument();
  });

  test('shows loading spinner while fetching users', async () => {
    const { getUsers } = require('../services/api');
    getUsers.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByText(/No users found. Create one to get started!/i)
      ).toBeInTheDocument()
    );
  });

  test('renders map component', async () => {
    await act(async () => {
      render(<App />);
    });
    // The map container from react-leaflet should be in the document
    expect(document.querySelector('.leaflet-container')).toBeInTheDocument();
  });

  test('shows error message when API fails', async () => {
    const { getUsers } = require('../services/api');
    getUsers.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/API Error/i)).toBeInTheDocument();
  });
});