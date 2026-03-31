# FieldForce - GPS-Based Attendance & Real-Time Tracking System

<div align="center">

![FieldForce](https://img.shields.io/badge/FieldForce-v1.0-blue)
![License](https://img.shields.io/badge/License-MIT-success)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

**A comprehensive solution for municipal corporations to eliminate proxy attendance, reduce paperwork, and ensure worker safety with GPS-enabled real-time tracking and emergency alerts.**

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Roadmap](#roadmap)

</div>

---

## Overview

**FieldForce** is an intelligent attendance and workforce management system designed specifically for municipal corporations and field-based organizations. It leverages GPS technology, real-time location tracking, and AI-powered analytics to combat proxy attendance while maintaining complete transparency and worker safety.

### Problem Statement
Municipal corporations face significant challenges:
- **Proxy Attendance**: Workers submit attendance from office while stationed elsewhere
- **Paperwork Burden**: Manual attendance records are time-consuming and error-prone
- **Safety Concerns**: No real-time visibility into worker locations during emergencies
- **Fuel Waste**: Inefficient route planning leads to unnecessary fuel consumption

### Solution
FieldForce provides an all-in-one platform to:
- ✅ Ensure genuine attendance through GPS verification
- ✅ Eliminate manual paperwork with digital records
- ✅ Monitor worker safety with real-time location tracking
- ✅ Generate predictive insights through AI/ML analytics

---

## Features

### 🎯 Core Functionality

#### **GPS-Based Attendance**
- Real-time GPS location verification
- Geofence-based attendance validation
- Automatic check-in/check-out at designated work sites
- Historical attendance reports and analytics

#### **Real-Time Tracking**
- Live worker location dashboard with interactive maps
- Movement history and route tracking
- Multi-worker simultaneous tracking
- Instant location alerts

#### **Selfie Verification**
- GPS-enabled selfie capturing for attendance proof
- Photo timestamp and location metadata
- Timestamp verification to prevent manipulation
- Secure photo storage and retrieval

#### **Emergency Alerts**
- Real-time accident and emergency incident reporting
- Instant notifications to supervisors and emergency handlers
- Incident geolocation and severity tracking
- Immediate response coordination

#### **Admin Dashboard**
- Comprehensive workforce analytics
- Real-time monitoring of all field workers
- Attendance reports and trends
- Incident management and history
- Worker performance metrics

### 🚀 Upcoming Features
- **Analytics Dashboard**: Deep insights into attendance patterns, productivity metrics, and fuel efficiency
- **AI/ML Integration**: Predictive analytics, anomaly detection, route optimization
- **Advanced Reporting**: Custom report generation and data export
- **Automated Alerts**: Intelligent notifications based on rules and patterns

---

## Tech Stack

### 🔧 Backend
- **Runtime**: Java 17
- **Framework**: Spring Boot 3.2.4
- **Database**: MySQL (with H2 for development)
- **Security**: Spring Security with JWT authentication
- **ORM**: Spring Data JPA
- **Build Tool**: Maven

**Key Dependencies**:
- Spring Web, Security, Data JPA
- MySQL Connector, H2 Database
- Lombok for code generation

### 🎨 Frontend Dashboard
- **Framework**: React 19.2.4
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Mapping**: Leaflet + React Leaflet
- **Icons**: Lucide React
- **Styling**: CSS Modules

### 📱 Mobile App
- **Framework**: React Native 0.81.5
- **Platform Support**: iOS, Android, Web
- **Expo Toolchain**: Expo SDK 54
- **Navigation**: Expo Router & React Navigation
- **GPS/Location**: Expo Location API
- **Camera**: Expo Camera for selfies
- **Local Storage**: Expo SQLite, AsyncStorage
- **Maps**: React Native Maps
- **UI Components**: Expo Vector Icons

---

## Project Structure

```
FieldForce-App/
├── backend/                    # Java Spring Boot backend
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── pom.xml                # Maven configuration
│   └── apache-maven-3.9.6/    # Maven distribution
│
├── dashboard/                  # React admin dashboard
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # Redux store
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── config/            # Configuration files
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── mobile/                     # React Native mobile app
    ├── app/                   # Expo Router app structure
    ├── components/            # Native components
    ├── lib/                   # Libraries (API, DB, config)
    ├── constants/             # App constants
    ├── assets/                # Images, fonts
    ├── hooks/                 # Custom React hooks
    ├── scripts/               # Build scripts
    ├── package.json
    ├── app.json               # Expo configuration
    ├── metro.config.js        # Metro bundler config
    └── eslint.config.js
```

---

## Quick Start

### Prerequisites
- **Java 17+** and Maven 3.9.6+
- **Node.js 18+** and npm/yarn
- **MySQL 8.0+** (or use H2 for development)
- **Expo CLI**: `npm install -g expo-cli`

### Backend Setup

```bash
# Navigate to backend
cd backend

# Configure database (update application.properties)
# For development with H2: no setup needed
# For MySQL: Update your credentials in application.properties

# Build and run
mvn clean install
mvn spring-boot:run

# Backend runs on http://localhost:8080
```

**Environment Configuration** (`application.properties`):
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/fieldforce
spring.datasource.username=your_username
spring.datasource.password=your_password

# Use dev profile for H2 database
spring.profiles.active=dev
```

### Dashboard Setup

```bash
# Navigate to dashboard
cd dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Dashboard runs on http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile App Setup

```bash
# Navigate to mobile app
cd mobile

# Install dependencies
npm install

# Start the app
npm start

# Choose platform:
# - Press 'a' for Android
# - Press 'i' for iOS
# - Press 'w' for Web
# - Press 's' for Expo Go

# Run on specific platform
npm run android
npm run ios
npm run web

# Clear cache if needed
npm run clear-cache
```

---

## API Documentation

### Base URL
```
https://api.fieldforce.local:8080/api
```

### Authentication
All endpoints (except login) require JWT token in `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Key Endpoints

#### Authentication
```
POST   /auth/login              - User login
POST   /auth/register           - User registration
POST   /auth/refresh            - Refresh JWT token
POST   /auth/logout             - User logout
```

#### Attendance
```
POST   /attendance/check-in     - Check-in with GPS coordinates
POST   /attendance/check-out    - Check-out with GPS coordinates
GET    /attendance/history      - Get attendance history
GET    /attendance/reports      - Generate attendance reports
POST   /attendance/selfie       - Upload selfie with metadata
```

#### Real-Time Tracking
```
GET    /tracking/live-locations - Get all worker live locations
GET    /tracking/worker/:id     - Get specific worker location
GET    /tracking/history        - Get location history
```

#### Emergency Alerts
```
POST   /alerts/emergency        - Report emergency incident
GET    /alerts/incidents        - Get all incidents
PATCH  /alerts/incidents/:id    - Update incident status
```

#### Admin Dashboard
```
GET    /dashboard/stats         - Get dashboard statistics
GET    /dashboard/workers       - Get all workers
GET    /dashboard/attendance    - Get attendance summary
GET    /reports/generate        - Generate custom reports
```

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FieldForce Ecosystem                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐    ┌──────────────────────┐       │
│  │   Mobile App (RN)    │    │   Admin Dashboard    │       │
│  │  - GPS Tracking      │    │   React + Vite       │       │
│  │  - Selfie Capture    │◄──►│  - Worker Monitoring │       │
│  │  - Emergency Alerts  │    │  - Report Generation │       │
│  └──────────────────────┘    └──────────────────────┘       │
│           ▲                             ▲                     │
│           │                             │                     │
│           └──────────────┬──────────────┘                     │
│                          │                                    │
│                   ┌──────▼──────┐                            │
│                   │  API Gateway │                            │
│                   │  (REST/JSON) │                            │
│                   └──────┬───────┘                            │
│                          │                                    │
│              ┌───────────┼───────────┐                       │
│              │           │           │                       │
│        ┌─────▼────┐ ┌────▼─────┐ ┌──▼──────┐              │
│        │ Auth     │ │ Attendance│ │Tracking │              │
│        │ Service  │ │ Service   │ │Service  │              │
│        └─────┬────┘ └────┬─────┘ └──┬──────┘              │
│              │           │           │                       │
│              │  Spring   │           │                       │
│              │  Boot     │  Alerts   │                       │
│              │  Backend  │ Service   │                       │
│              │           │           │                       │
│        ┌─────▼───────────▼───────────▼─────┐               │
│        │     Core Business Logic Layer      │               │
│        └─────┬───────────────────────────────┘               │
│              │                                                │
│        ┌─────▼──────────────┐                               │
│        │   MySQL Database   │                               │
│        │   (Primary)        │                               │
│        │   + H2 (Dev)       │                               │
│        └────────────────────┘                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Attendance Check-In Process**:
1. Mobile app captures GPS location and timestamp
2. Selfie is captured with camera API
3. Data sent to backend API with JWT authentication
4. Backend validates geofence boundaries
5. Attendance record created in database
6. Dashboard updates in real-time
7. Confirmation sent to mobile app

---

## Security Features

🔒 **Security Measures Implemented**:
- JWT token-based authentication
- Password encryption using bcrypt
- Spring Security configuration
- Role-based access control (RBAC)
- Input validation and sanitization
- HTTPS/TLS for data transmission
- GPS coordinate validation
- Timestamp verification to prevent spoofing

---

## Database Schema

### Key Tables
- `users` - Worker and admin accounts
- `attendance` - Attendance records with GPS coordinates
- `selfies` - Selfie photos with metadata
- `locations` - Real-time worker locations
- `incidents` - Emergency alerts and incidents
- `geofences` - Work site boundaries

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow code style conventions for each language
- Write meaningful commit messages
- Add tests for new features
- Update documentation accordingly
- Ensure code passes linting

---

## Roadmap

### Phase 1: Current Release ✅
- [x] GPS-based attendance system
- [x] Real-time worker tracking
- [x] Selfie verification
- [x] Emergency alert system
- [x] Basic admin dashboard

### Phase 2: Analytics & Intelligence 🚀
- [ ] Analytics dashboard with KPIs
- [ ] Advanced reporting with exports
- [ ] Predictive attendance analytics
- [ ] Route optimization using AI
- [ ] Automated anomaly detection

### Phase 3: AI/ML Integration 🤖
- [ ] Machine learning for pattern recognition
- [ ] Predictive worker scheduling
- [ ] Computer vision for selfie verification
- [ ] Natural language processing for reports
- [ ] Intelligent alert system with ML

### Phase 4: Enhanced Features
- [ ] Mobile app offline support
- [ ] Biometric authentication
- [ ] Integration with third-party apps
- [ ] Advanced compliance reporting
- [ ] Multi-language support

---

## Performance & Scalability

- **Real-Time Updates**: WebSocket support for live location streaming
- **Database Optimization**: Indexed queries, connection pooling
- **Caching**: Redis integration for frequently accessed data (planned)
- **Load Balancing**: Containerized deployment support
- **Horizontal Scaling**: Microservices-ready architecture

---

## Troubleshooting

### Common Issues

**Backend Connection Issues**
```bash
# Check if MySQL is running
mysql -u root -p

# Verify backend is running on correct port
curl http://localhost:8080/api/health
```

**GPS Not Working on Mobile**
- Ensure location permissions are granted
- Check GPS is enabled on device
- Verify backend geofence configuration

**Dashboard Not Connecting**
- Check backend is running on port 8080
- Verify API endpoint in dashboard config
- Check browser console for CORS errors

---

## Support & Documentation

📚 **Resources**:
- [Backend README](./backend/README.md) - Detailed backend documentation
- [Dashboard README](./dashboard/README.md) - Frontend dashboard guide
- [Mobile README](./mobile/README.md) - Mobile app setup guide
- [API Documentation](./docs/API.md) - Complete API reference

💬 **Questions or Issues?**
- Open an issue on GitHub
- Contact the development team
- Check documentation first

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Team & Acknowledgments

**Development Team**: FieldForce Development Division

**Technology Stack Acknowledgments**:
- Spring Boot & Spring Security
- React & React Native teams
- Expo community
- Material Design & Lucide Icons
- Leaflet mapping library

---

<div align="center">

**Built with ❤️ for Municipal Corporations**

[⬆ back to top](#fieldforce---gps-based-attendance--real-time-tracking-system)

</div>
