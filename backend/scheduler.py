from apscheduler.schedulers.background import BackgroundScheduler
from database import db, Sensor, SensorReading, Alert
from datetime import datetime
import random

scheduler = BackgroundScheduler()

# Sensor profiles with realistic base values
SENSOR_PROFILES = {
    'Bureau Principal': {'base_co2': 650, 'base_temp': 22.5, 'base_humidity': 45, 'occupancy_factor': 0.8},
    'Salle de Réunion Alpha': {'base_co2': 800, 'base_temp': 23.2, 'base_humidity': 48, 'occupancy_factor': 1.5},
    'Open Space Dev': {'base_co2': 750, 'base_temp': 21.8, 'base_humidity': 52, 'occupancy_factor': 1.2},
    'Cafétéria': {'base_co2': 600, 'base_temp': 23.5, 'base_humidity': 42, 'occupancy_factor': 1.0},
    'Salle Serveur': {'base_co2': 450, 'base_temp': 19.0, 'base_humidity': 35, 'occupancy_factor': 0.1},
}

def get_sensor_profile(sensor_name):
    """Get sensor profile or return default"""
    return SENSOR_PROFILES.get(sensor_name, {
        'base_co2': 700, 
        'base_temp': 22.0, 
        'base_humidity': 50, 
        'occupancy_factor': 1.0
    })

def generate_co2_pattern(hour, base_value, occupancy_factor=1.0, sensor_name=''):
    """Generate realistic CO2 patterns based on time of day and space type"""
    # Office hours pattern (more occupancy during work hours)
    if 'Salle de Réunion' in sensor_name:
        # Meeting rooms: spikes during meeting times
        meeting_times = {
            9: 300, 10: 400, 11: 350, 14: 400, 15: 350, 16: 300
        }
        pattern_offset = meeting_times.get(hour, 0)
    elif 'Cafétéria' in sensor_name:
        # Cafeteria: peaks during lunch and break times
        meal_times = {
            8: 150, 9: 100, 12: 350, 13: 300, 17: 200, 18: 150
        }
        pattern_offset = meal_times.get(hour, -100)
    elif 'Serveur' in sensor_name:
        # Server room: consistently low with minimal variation
        pattern_offset = random.randint(-20, 20)
    else:
        # Office/default: gradual increase during work hours
        patterns = {
            0: -200, 1: -220, 2: -230, 3: -240, 4: -230, 5: -200,
            6: -150, 7: -50, 8: 100, 9: 200, 10: 250, 11: 280,
            12: 250, 13: 280, 14: 300, 15: 280, 16: 250, 17: 150,
            18: 50, 19: -50, 20: -100, 21: -150, 22: -180, 23: -190
        }
        pattern_offset = patterns.get(hour, 0)
    
    # Apply occupancy factor
    pattern_offset = int(pattern_offset * occupancy_factor)
    
    # Add random variation (±50 ppm)
    variation = random.randint(-50, 50)
    
    # Calculate final value
    final_value = base_value + pattern_offset + variation
    
    # Clamp to realistic ranges
    return max(400, min(1500, final_value))


def generate_temperature(base_temp, hour, sensor_name=''):
    """Generate realistic temperature variations"""
    if 'Serveur' in sensor_name:
        # Server room: cooler and more stable
        variation = (random.random() - 0.5) * 0.3
    else:
        # Normal rooms: slight variation throughout day
        daily_pattern = {
            0: -0.5, 1: -0.6, 2: -0.7, 3: -0.7, 4: -0.6, 5: -0.5,
            6: -0.3, 7: 0.0, 8: 0.3, 9: 0.5, 10: 0.7, 11: 0.8,
            12: 0.8, 13: 0.9, 14: 1.0, 15: 0.9, 16: 0.7, 17: 0.5,
            18: 0.3, 19: 0.0, 20: -0.2, 21: -0.3, 22: -0.4, 23: -0.5
        }
        daily_offset = daily_pattern.get(hour, 0)
        variation = daily_offset + (random.random() - 0.5) * 0.4
    
    return round((base_temp + variation) * 10) / 10


def generate_humidity(base_humidity, hour, sensor_name=''):
    """Generate realistic humidity variations"""
    if 'Serveur' in sensor_name:
        # Server room: lower and more controlled humidity
        variation = (random.random() - 0.5) * 2
    else:
        # Normal variation (±5%)
        variation = (random.random() - 0.5) * 10
    
    return max(30, min(70, round(base_humidity + variation)))


def simulate_sensor_readings(app, socketio):
    """Generate simulated sensor readings for all simulation sensors"""
    with app.app_context():
        try:
            # Get all simulation sensors that are live
            sensors = Sensor.query.filter_by(sensor_type='simulation', is_live=True).all()
            
            if not sensors:
                return
            
            # Use local time for realistic patterns
            current_time = datetime.now()
            hour = current_time.hour
            
            for sensor in sensors:
                # Get sensor profile based on name
                profile = get_sensor_profile(sensor.name)
                
                # Generate realistic readings based on sensor profile
                co2_reading = generate_co2_pattern(
                    hour, 
                    profile['base_co2'], 
                    profile['occupancy_factor'],
                    sensor.name
                )
                temp_reading = generate_temperature(profile['base_temp'], hour, sensor.name)
                humidity_reading = generate_humidity(profile['base_humidity'], hour, sensor.name)
                
                new_reading = SensorReading(
                    sensor_id=sensor.id,
                    co2=co2_reading,
                    temperature=temp_reading,
                    humidity=humidity_reading,
                    recorded_at=datetime.utcnow()
                )
                
                db.session.add(new_reading)
                
                # Update sensor status based on CO2 level
                old_status = sensor.status
                if new_reading.co2 > 1200:
                    sensor.status = 'avertissement'
                    # Create critical alert
                    if old_status != 'avertissement':
                        alert = Alert(
                            sensor_id=sensor.id,
                            user_id=sensor.user_id,
                            alert_type='critique',
                            message=f'CO2 critique détecté: {new_reading.co2} ppm',
                            value=new_reading.co2,
                            status='nouvelle'
                        )
                        db.session.add(alert)
                elif new_reading.co2 > 1000:
                    sensor.status = 'avertissement'
                    # Create warning alert
                    if old_status == 'en ligne':
                        alert = Alert(
                            sensor_id=sensor.id,
                            user_id=sensor.user_id,
                            alert_type='avertissement',
                            message=f'CO2 élevé détecté: {new_reading.co2} ppm',
                            value=new_reading.co2,
                            status='nouvelle'
                        )
                        db.session.add(alert)
                else:
                    sensor.status = 'en ligne'
                
                sensor.updated_at = datetime.utcnow()
                
                # Emit real-time update via WebSocket
                socketio.emit('sensor_update', {
                    'sensor_id': sensor.id,
                    'reading': new_reading.to_dict()
                }, namespace='/')
            
            db.session.commit()
            print(f"[{current_time.strftime('%H:%M:%S')}] Generated {len(sensors)} sensor readings (Hour: {hour})")
            
        except Exception as e:
            db.session.rollback()
            print(f"Error generating sensor readings: {e}")


def init_scheduler(app, socketio):
    """Initialize the scheduler for periodic tasks"""
    # Schedule sensor simulation every 5 seconds
    scheduler.add_job(
        func=lambda: simulate_sensor_readings(app, socketio),
        trigger='interval',
        seconds=5,
        id='sensor_simulation',
        name='Simulate sensor readings every 5 seconds',
        replace_existing=True
    )
    
    scheduler.start()
    print("Scheduler initialized - Sensor simulation will run every 5 seconds")
