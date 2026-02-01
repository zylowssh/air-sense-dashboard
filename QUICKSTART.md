# Quick Start Guide - Aerium Air Quality Monitoring

## 🚀 Getting Started in 5 Minutes

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

#### Step 1: Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

#### Step 2: Start Frontend (in new terminal)
```bash
npm install
cp .env.example .env
npm run dev
```

### Step 3: Access the Application

1. Open http://localhost:8080 in your browser
2. Click "Create Account" and register
3. Login with your credentials
4. Navigate to "Sensors" and click "Add Sensor"
5. Watch your dashboard fill with real-time data!

## 📊 What You'll See

### Dashboard
- **Real-time KPIs**: CO₂ levels, temperature, humidity, air quality score
- **Live Sensors**: All your sensors updating every 5 seconds
- **Trends**: 24-hour charts showing air quality patterns
- **Alerts**: Notifications when CO₂ levels exceed thresholds

### Features Available
✅ User authentication with JWT
✅ Real-time sensor data via WebSocket
✅ Automated sensor simulation
✅ Beautiful, responsive UI
✅ Role-based access control
✅ Data visualization with charts
✅ Sensor management (CRUD)
✅ Profile settings

## 🔧 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify Python 3.9+ is installed: `python --version`
- Ensure all packages installed: `pip install -r requirements.txt`

### Frontend won't start
- Check if port 8080 is already in use
- Verify Node.js 18+ is installed: `node --version`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Can't login/register
- Ensure backend is running on http://localhost:5000
- Check browser console for errors
- Verify `.env` file exists with `VITE_API_URL=http://localhost:5000/api`

### No sensor data showing
- Sensors need 1 second after creation to start generating data
- Check if sensor type is set to "simulation"
- Verify WebSocket connection in browser console

## 📱 First Steps After Setup

1. **Create Your First Sensor**
   - Go to "Sensors" page
   - Click "Add Sensor"
   - Name: "Office Sensor"
   - Location: "Main Office"
   - Type: "Simulation"
   - Click "Create"

2. **Wait 1 Second**
   - Backend generates data every second
   - Watch the dashboard update automatically

3. **Explore Features**
   - Dashboard: Overview of all sensors
   - Analytics: Detailed charts and trends
   - Comparison: Compare multiple sensors
   - Alerts: View notifications
   - Settings: Customize your experience

## 🎯 Demo Credentials

Use these pre-configured demo accounts (after running `python seed_database.py`):

**Regular User Account:**
- Email: `demo@aerium.app`
- Password: `demo123`
- Includes 4 pre-configured sensors with 24 hours of historical data

**Admin Account:**
- Email: `admin@aerium.app`
- Password: `admin123`
- Full system access with admin privileges

Or create your own account - first registered user gets user role.

## 🔐 Security Notes

**Development Environment:**
- Change `SECRET_KEY` in backend/.env
- Change `JWT_SECRET_KEY` in backend/.env
- Use strong passwords

**Production Deployment:**
- Set strong secret keys
- Enable HTTPS
- Use production-grade database (PostgreSQL)
- Implement rate limiting
- Add monitoring and logging

## 📚 API Documentation

Full API documentation available at:
- Backend: http://localhost:5000/api/health (health check)
- See [MIGRATION.md](MIGRATION.md) for complete endpoint list

## 🆘 Need Help?

- Check [README.md](README.md) for detailed setup
- Review [MIGRATION.md](MIGRATION.md) for architecture details
- Open an issue on GitHub

## ✨ What's Next?

- Add more sensors
- Explore the Analytics page
- Try the Comparison feature
- Customize your dashboard
- Set up email alerts (coming soon)
- Export data (coming soon)

---

**Happy Monitoring! 🌬️**
