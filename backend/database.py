from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255))
    role = db.Column(db.String(50), default='user')  # 'user' or 'admin'
    avatar_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    sensors = db.relationship('Sensor', backref='owner', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Sensor(db.Model):
    __tablename__ = 'sensors'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='en ligne')  # 'en ligne', 'hors ligne', 'avertissement'
    sensor_type = db.Column(db.String(50), default='simulation')  # 'real' or 'simulation'
    battery = db.Column(db.Integer, default=100)
    is_live = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    readings = db.relationship('SensorReading', backref='sensor', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_latest_reading=False):
        result = {
            'id': str(self.id),
            'user_id': self.user_id,
            'name': self.name,
            'location': self.location,
            'status': self.status,
            'sensor_type': self.sensor_type,
            'battery': self.battery,
            'is_live': self.is_live,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_latest_reading and self.readings:
            latest = max(self.readings, key=lambda r: r.recorded_at)
            result['co2'] = latest.co2
            result['temperature'] = latest.temperature
            result['humidity'] = latest.humidity
            result['lastReading'] = latest.recorded_at.isoformat()
        
        return result


class SensorReading(db.Model):
    __tablename__ = 'sensor_readings'
    
    id = db.Column(db.Integer, primary_key=True)
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensors.id'), nullable=False)
    co2 = db.Column(db.Float, nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sensor_id': self.sensor_id,
            'co2': self.co2,
            'temperature': self.temperature,
            'humidity': self.humidity,
            'recorded_at': self.recorded_at.isoformat()
        }


class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensors.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    alert_type = db.Column(db.String(50), nullable=False)  # 'avertissement', 'critique', 'info'
    message = db.Column(db.String(500), nullable=False)
    value = db.Column(db.Float)
    status = db.Column(db.String(50), default='nouvelle')  # 'nouvelle', 'reconnue', 'résolue'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        sensor = Sensor.query.get(self.sensor_id)
        return {
            'id': str(self.id),
            'sensorId': str(self.sensor_id),
            'sensorName': sensor.name if sensor else 'Unknown',
            'type': self.alert_type,
            'message': self.message,
            'value': self.value,
            'status': self.status,
            'timestamp': self.created_at.isoformat()
        }


def init_db():
    """Initialize the database and create tables"""
    db.create_all()
    print("Database initialized successfully")
