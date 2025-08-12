# Weather App - User Weather Dashboard for SouthGeeks Techincal Interview

A full-stack weather application that lets you manage users, view their locations on an interactive map, and check current weather and nearby tourist attractions. Built with modern cloud-native architecture using React, AWS Lambda, and Firebase.

## 🚀 Features

- **User Management**: Full CRUD operations with zip code validation
- **Interactive Map**: Visual display of all user locations
- **Real-time Weather**: Current weather data via OpenWeatherMap API
- **Tourist Attractions**: Nearby points of interest via Geoapify API
- **Real-time Updates**: Live data synchronization with polling
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Serverless Backend**: Scalable AWS Lambda architecture

## 🏗️ Architecture Overview

This application follows a modern, decoupled architecture:

- **Frontend**: React + Vite for fast development and optimized builds
- **Backend**: Serverless AWS Lambda functions with Node.js
- **Database**: Firebase Realtime Database for real-time data sync
- **APIs**: OpenWeatherMap (weather) + Geoapify (places)
- **Deployment**: AWS SAM for serverless infrastructure

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and npm
- **AWS Account** (free tier works)
- **AWS CLI** and **SAM CLI** installed
- **API Keys** from the services below

## 🔑 Required API Keys

You'll need to create a `.env` file in the `backend` directory with these API keys:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id

# OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweather_api_key

# Geoapify API
GEOAPIFY_API_KEY=your_geoapify_api_key
```

### Getting API Keys

1. **Firebase**: [Firebase Console](https://console.firebase.google.com/) → Create project → Realtime Database → Web app
2. **OpenWeatherMap**: [Sign up](https://openweathermap.org/api) for free account
3. **Geoapify**: [Sign up](https://www.geoapify.com/) for free account

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd weatherapp_southgeeks
```

### 2. Install Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../frontend && npm install

# Return to root
cd ..
```

### 3. Run Development Servers

```bash
npm run dev
```

This starts both servers:
- **Frontend**: http://localhost:5173/
- **Backend**: http://localhost:3001/

## 🧪 Testing

The application includes comprehensive testing:

```bash
# Backend tests (85%+ coverage)
cd backend
npm test

# Frontend tests (55%+ coverage)
cd ../frontend
npm test

# Run all tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### AWS Lambda Deployment

The backend is ready for serverless deployment:

```bash
cd backend
sam build
sam deploy --guided
```

### Frontend Deployment

Build and deploy the frontend to any static hosting service:

```bash
cd frontend
npm run build
```

## 🏛️ Project Structure

```
weatherapp_southgeeks/
├── backend/                 # AWS Lambda backend
│   ├── src/
│   │   ├── handlers/        # Lambda function handlers
│   │   ├── services/        # External API integrations
│   │   └── utils/          # Validation & utilities
│   └── template.yaml       # SAM deployment template
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   └── services/       # API client
│   └── vite.config.js      # Vite configuration
└── README.md               # This file
```

## 🔧 Technical Decisions

- **Serverless**: AWS Lambda for automatic scaling and cost efficiency
- **Firebase**: Real-time database with offline support
- **React + Vite**: Modern frontend with fast builds
- **Polling**: Simple real-time updates without WebSocket complexity
- **Caching**: In-memory caching for external API responses

## 🐛 Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all environment variables are set in `backend/.env`
2. **CORS Issues**: Backend includes proper CORS configuration
3. **Cold Starts**: Lambda functions use 1024MB memory for faster startup
4. **Real-time Updates**: Frontend polls every 1.5 seconds for live data

### Development Tips

- Use `npm run dev` for concurrent frontend/backend development
- Check browser console and Lambda CloudWatch logs for debugging
- Test with valid US zip codes (e.g., 10001, 90210)

## 📚 Additional Resources

- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) - **Deep dive into technical decisions, architecture patterns, and data flow**
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request



---

**Built with ❤️ using modern web technologies for southgeeks**
