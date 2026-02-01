# Aerium Air Quality Monitoring Platform

Air quality monitoring dashboard with real-time sensor data visualization.

## 🚀 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- Axios
- Socket.IO Client
- Recharts
- Framer Motion

**Backend:**
- Flask (Python)
- SQLite with SQLAlchemy
- Flask-JWT-Extended
- Flask-SocketIO
- APScheduler (sensor simulation)

## 📋 Prerequisites

- Node.js 18+ and npm/bun
- Python 3.9+
- pip

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd air-sense-dashboard
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and set your secret keys

# Seed demo data (optional but recommended)
python seed_database.py

# Run the Flask server
python app.py
```

The backend will start on `http://localhost:5000`

**Demo Accounts:**
- User: `demo@aerium.app` / `demo123`
- Admin: `admin@aerium.app` / `admin123`

### 3. Frontend Setup

```bash
cd ..  # Return to root directory

# Install dependencies
npm install
# or
bun install

# Configure environment variables
cp .env.example .env
# The default API URL is http://localhost:5000/api

# Run the development server
npm run dev
# or
bun dev
```

The frontend will start on `http://localhost:8080`

## 🎯 Features

- **Real-time Monitoring**: Live sensor data updates via WebSocket
- **User Authentication**: JWT-based secure authentication
- **Dashboard**: Overview of all sensors with KPIs and trends
- **Analytics**: Detailed charts and data visualization
- **Sensor Management**: CRUD operations for sensors
- **Automated Simulation**: Realistic sensor data generation every 5 seconds
- **Role-Based Access**: Admin and user roles
- **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

```
air-sense-dashboard/
├── backend/                 # Flask backend
│   ├── app.py              # Main Flask application
│   ├── database.py         # SQLAlchemy models
│   ├── scheduler.py        # Automated tasks
│   └── routes/             # API endpoints
│       ├── auth.py         # Authentication
│       ├── sensors.py      # Sensor management
│       ├── readings.py     # Sensor readings
│       └── users.py        # User management
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and API client
│   └── contexts/           # React contexts
└── public/                 # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Sensors
- `GET /api/sensors` - Get all sensors
- `GET /api/sensors/:id` - Get sensor by ID
- `POST /api/sensors` - Create new sensor
- `PUT /api/sensors/:id` - Update sensor
- `DELETE /api/sensors/:id` - Delete sensor

### Readings
- `GET /api/readings/sensor/:id` - Get sensor readings
- `POST /api/readings` - Add new reading
- `GET /api/readings/aggregate` - Get aggregate statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `GET /api/users` - Get all users (admin only)

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Use Gunicorn or similar WSGI server:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend Deployment

```bash
npm run build
# Deploy the `dist` folder to your hosting service
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Role-based access control
- Input validation

## 📝 Development

### Run Tests (Frontend)

```bash
npm run test
```

### Run Linter

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for better air quality monitoring**
