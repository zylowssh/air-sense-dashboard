# Migration from Supabase to Flask/SQLite - Complete! ✅

## Summary

The Aerium Air Sense Dashboard has been successfully migrated from Supabase/PostgreSQL to Flask/SQLite.

## Changes Made

### Backend (New Flask API)
- ✅ Created Flask backend in `backend/` directory
- ✅ Implemented SQLite database with SQLAlchemy ORM
- ✅ Created 4 database models: User, Sensor, SensorReading, Alert
- ✅ Implemented JWT-based authentication
- ✅ Created RESTful API endpoints for:
  - Authentication (register, login, logout, refresh token)
  - Sensors (CRUD operations)
  - Sensor readings (fetch, create, aggregate)
  - Users (profile management, password change)
- ✅ Implemented WebSocket support for real-time updates
- ✅ Created automated sensor simulation scheduler (runs every 5 seconds)
- ✅ Added comprehensive error handling and CORS support

### Frontend Updates
- ✅ Created new `apiClient.ts` with Axios for Flask API communication
- ✅ Updated `useAuth` hook to use Flask JWT authentication
- ✅ Updated `useSensors` hook with WebSocket support
- ✅ Refactored Auth page to use new API
- ✅ Updated Dashboard to fetch real data from backend
- ✅ Updated Sensors page to display backend data
- ✅ Added axios and socket.io-client dependencies
- ✅ Removed @supabase/supabase-js dependency
- ✅ Removed Supabase integration files
- ✅ Created environment configuration files

### Configuration
- ✅ Created `.env.example` for both frontend and backend
- ✅ Updated `.gitignore` for Python/Flask
- ✅ Created comprehensive README with setup instructions

## How to Run

### 1. Start Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Edit and set your secret keys
python app.py
```

Backend runs on: http://localhost:5000

### 2. Start Frontend

```bash
# In project root
npm install  # or bun install
cp .env.example .env
npm run dev  # or bun dev
```

Frontend runs on: http://localhost:8080

### 3. First Time Setup

1. Navigate to http://localhost:8080
2. Click "Create Account" to register
3. Login with your credentials
4. Go to "Sensors" page and click "Add Sensor" to create your first sensor
5. The backend will automatically start generating simulated readings every second

## Architecture

### Backend Stack
- **Flask**: Web framework
- **SQLite**: Database (file-based, no setup required)
- **SQLAlchemy**: ORM
- **Flask-JWT-Extended**: Authentication
- **Flask-SocketIO**: Real-time WebSocket communication
- **APScheduler**: Background task scheduler

### Frontend Stack
- **React + TypeScript**: UI framework
- **Axios**: HTTP client
- **Socket.IO Client**: Real-time updates
- **React Router**: Navigation
- **Tailwind CSS**: Styling

## API Features

### Authentication
- JWT token-based auth
- Access token (24h) + Refresh token (30d)
- Automatic token refresh on expiry
- Role-based access (admin/user)

### Real-time Updates
- WebSocket connection for live sensor data
- Automatic sensor simulation every second
- Realistic CO2, temperature, humidity patterns

### Data Management
- Full CRUD for sensors
- Time-series sensor readings
- Aggregate statistics
- User profile management

## Database Schema

```
users
├── id (PK)
├── email (unique)
├── password_hash
├── full_name
├── role (admin/user)
└── timestamps

sensors
├── id (PK)
├── user_id (FK)
├── name
├── location
├── status
├── sensor_type (real/simulation)
├── battery
└── timestamps

sensor_readings
├── id (PK)
├── sensor_id (FK)
├── co2
├── temperature
├── humidity
└── recorded_at

alerts
├── id (PK)
├── sensor_id (FK)
├── user_id (FK)
├── alert_type
├── message
└── status
```

## Next Steps

### Recommended Enhancements
1. Add pagination for sensor readings
2. Implement data export (CSV/JSON)
3. Add email alerts for critical CO2 levels
4. Implement data retention policies
5. Add admin dashboard for user management
6. Deploy to production (Heroku, Railway, etc.)

### Testing
- Add unit tests for backend routes
- Add integration tests for API endpoints
- Add frontend component tests
- Setup CI/CD pipeline

## Troubleshooting

### Backend Issues
- **Port 5000 in use**: Change port in `app.py`
- **Database errors**: Delete `aerium.db` and restart
- **Import errors**: Ensure all dependencies are installed

### Frontend Issues
- **CORS errors**: Check backend CORS configuration
- **Connection failed**: Verify backend is running on port 5000
- **Auth errors**: Clear localStorage and re-login

## Migration Complete! 🎉

The application is now fully operational with Flask/SQLite backend and no Supabase dependencies.
