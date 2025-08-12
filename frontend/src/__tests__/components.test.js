import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import UserListItem from '../components/UserListItem';
import WeatherInfo from '../components/WeatherInfo';
import TouristSpots from '../components/TouristSpots';
import 'whatwg-fetch';

// Mock react-leaflet to avoid canvas issues in tests
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}));

// Mock react-icons/wi to avoid icon rendering issues
jest.mock('react-icons/wi', () => ({
  WiDaySunny: () => <div data-testid="sunny-icon">☀️</div>,
  WiCloudy: () => <div data-testid="cloudy-icon">☁️</div>,
  WiRain: () => <div data-testid="rain-icon">🌧️</div>,
  WiSnow: () => <div data-testid="snow-icon">❄️</div>,
  WiThunderstorm: () => <div data-testid="thunder-icon">⛈️</div>,
}));

describe('UserForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create user form by default', () => {
    render(<UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText('Create User')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Zip Code')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  test('renders edit user form when initialData provided', () => {
    const initialData = { name: 'John Doe', zip: '12345' };
    render(<UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} initialData={initialData} />);
    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('calls onSubmit with form data', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Zip Code'), { target: { value: '54321' } });
    fireEvent.click(screen.getByText('Create'));

    expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Jane Doe', zip: '54321' });
  });

  test('calls onCancel when cancel button clicked', () => {
    const initialData = { name: 'John Doe', zip: '12345' };
    render(<UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} initialData={initialData} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('form validation requires both fields', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    // Try to submit empty form
    fireEvent.click(screen.getByText('Create'));
    
    // Form should prevent submission due to required attributes
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});

describe('UserList Component', () => {
  const mockUsers = {
    '1': { id: '1', name: 'Alice', zip: '90210', latitude: 34.0522, longitude: -118.2437 },
    '2': { id: '2', name: 'Bob', zip: '10001', latitude: 40.7128, longitude: -74.0060 }
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onShowWeather: jest.fn(),
    onShowPlaces: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders list of users', () => {
    render(<UserList users={mockUsers} {...mockHandlers} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('shows empty state when no users', () => {
    render(<UserList users={{}} {...mockHandlers} />);
    expect(screen.getByText(/No users found. Create one to get started!/i)).toBeInTheDocument();
  });

  test('shows empty state when users is null', () => {
    render(<UserList users={null} {...mockHandlers} />);
    expect(screen.getByText(/No users found. Create one to get started!/i)).toBeInTheDocument();
  });
});

describe('UserListItem Component', () => {
  const mockUser = {
    id: '1',
    name: 'Alice',
    zip: '90210',
    latitude: 34.0522,
    longitude: -118.2437
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onShowWeather: jest.fn(),
    onShowPlaces: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user information', () => {
    render(<UserListItem user={mockUser} {...mockHandlers} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('90210')).toBeInTheDocument();
    expect(screen.getByText('34.05, -118.24')).toBeInTheDocument();
  });

  test('calls onEdit when edit button clicked', () => {
    render(<UserListItem user={mockUser} {...mockHandlers} />);
    fireEvent.click(screen.getByText(/Edit/i));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockUser);
  });

  test('calls onDelete when delete button clicked', () => {
    render(<UserListItem user={mockUser} {...mockHandlers} />);
    fireEvent.click(screen.getByText(/Delete/i));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockUser.id);
  });

  test('calls onShowWeather when weather button clicked', () => {
    render(<UserListItem user={mockUser} {...mockHandlers} />);
    fireEvent.click(screen.getByText(/Weather/i));
    expect(mockHandlers.onShowWeather).toHaveBeenCalledWith(mockUser);
  });

  test('calls onShowPlaces when places button clicked', () => {
    render(<UserListItem user={mockUser} {...mockHandlers} />);
    fireEvent.click(screen.getByText(/Places/i));
    expect(mockHandlers.onShowPlaces).toHaveBeenCalledWith(mockUser);
  });
});

describe('WeatherInfo Component', () => {
  const mockWeather = {
    main: { temp: 72, humidity: 65 },
    weather: [{ id: 800, description: 'sunny' }],
    wind: { speed: 5 },
    name: 'Los Angeles'
  };

  const mockUser = { name: 'Alice', zip: '90210' };
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders weather information', () => {
    render(<WeatherInfo weather={mockWeather} user={mockUser} onClear={mockOnClear} />);
    expect(screen.getByText("Alice's Weather")).toBeInTheDocument();
    expect(screen.getByText('72°F')).toBeInTheDocument();
    expect(screen.getByText('sunny')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  });

  test('calls onClear when clear button clicked', () => {
    render(<WeatherInfo weather={mockWeather} user={mockUser} onClear={mockOnClear} />);
    fireEvent.click(screen.getByText('✕'));
    expect(mockOnClear).toHaveBeenCalled();
  });
});

describe('TouristSpots Component', () => {
  const mockPlaces = [
    { name: 'Central Park', address: 'New York, NY' },
    { name: 'Times Square', address: 'Manhattan, NY' }
  ];

  const mockUser = { name: 'Alice', zip: '10001' };
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders tourist places', () => {
    render(<TouristSpots places={mockPlaces} user={mockUser} onClear={mockOnClear} />);
    expect(screen.getByText('Tourist Spots Nearby')).toBeInTheDocument();
    expect(screen.getByText('Central Park')).toBeInTheDocument();
    expect(screen.getByText('Times Square')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('Manhattan, NY')).toBeInTheDocument();
  });

  test('calls onClear when clear button clicked', () => {
    render(<TouristSpots places={mockPlaces} user={mockUser} onClear={mockOnClear} />);
    fireEvent.click(screen.getByText('✕'));
    expect(mockOnClear).toHaveBeenCalled();
  });
});
