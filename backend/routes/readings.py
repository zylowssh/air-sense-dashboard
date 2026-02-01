from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db, SensorReading, Sensor, User
from datetime import datetime, timedelta

readings_bp = Blueprint('readings', __name__)

@readings_bp.route('/sensor/<int:sensor_id>', methods=['GET'])
@jwt_required()
def get_sensor_readings(sensor_id):
    """Get readings for a specific sensor"""
    try:
        current_user_id = get_jwt_identity()
        
        # Convert to int if string
        if isinstance(current_user_id, str):
            current_user_id = int(current_user_id)
            
        user = User.query.get(current_user_id)
        
        sensor = Sensor.query.get(sensor_id)
        
        if not sensor:
            return jsonify({'error': 'Sensor not found'}), 404
        
        # Check ownership unless admin
        if user.role != 'admin' and sensor.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized access to this sensor'}), 403
        
        # Get query parameters
        limit = request.args.get('limit', 100, type=int)
        hours = request.args.get('hours', 24, type=int)
        
        # Calculate time range
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=hours)
        
        readings = SensorReading.query.filter(
            SensorReading.sensor_id == sensor_id,
            SensorReading.recorded_at >= start_time
        ).order_by(SensorReading.recorded_at.desc()).limit(limit).all()
        
        return jsonify({
            'readings': [reading.to_dict() for reading in readings]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@readings_bp.route('', methods=['POST'])
@jwt_required()
def add_reading():
    """Add a new sensor reading"""
    try:
        current_user_id = get_jwt_identity()
        
        # Convert to int if string
        if isinstance(current_user_id, str):
            current_user_id = int(current_user_id)
            
        user = User.query.get(current_user_id)
        
        data = request.get_json()
        
        sensor_id = data.get('sensor_id')
        co2 = data.get('co2')
        temperature = data.get('temperature')
        humidity = data.get('humidity')
        
        if not sensor_id or co2 is None or temperature is None or humidity is None:
            return jsonify({'error': 'sensor_id, co2, temperature, and humidity are required'}), 400
        
        sensor = Sensor.query.get(sensor_id)
        
        if not sensor:
            return jsonify({'error': 'Sensor not found'}), 404
        
        # Check ownership unless admin
        if user.role != 'admin' and sensor.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized access to this sensor'}), 403
        
        new_reading = SensorReading(
            sensor_id=sensor_id,
            co2=float(co2),
            temperature=float(temperature),
            humidity=float(humidity)
        )
        
        db.session.add(new_reading)
        
        # Update sensor status based on CO2 levels
        if co2 > 1200:
            sensor.status = 'avertissement'
        elif co2 < 1000:
            sensor.status = 'en ligne'
        
        sensor.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Reading added successfully',
            'reading': new_reading.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@readings_bp.route('/aggregate', methods=['GET'])
@jwt_required()
def get_aggregate_data():
    """Get aggregate sensor data for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Convert to int if string
        if isinstance(current_user_id, str):
            current_user_id = int(current_user_id)
            
        user = User.query.get(current_user_id)
        
        # Get all user's sensors
        if user.role == 'admin':
            sensors = Sensor.query.all()
        else:
            sensors = Sensor.query.filter_by(user_id=current_user_id).all()
        
        sensor_ids = [s.id for s in sensors]
        
        if not sensor_ids:
            return jsonify({
                'avgCo2': 0,
                'avgTemperature': 0,
                'avgHumidity': 0,
                'totalReadings': 0
            }), 200
        
        # Get recent readings (last 24 hours)
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=24)
        
        readings = SensorReading.query.filter(
            SensorReading.sensor_id.in_(sensor_ids),
            SensorReading.recorded_at >= start_time
        ).all()
        
        if not readings:
            return jsonify({
                'avgCo2': 0,
                'avgTemperature': 0,
                'avgHumidity': 0,
                'totalReadings': 0
            }), 200
        
        # Calculate averages
        avg_co2 = sum(r.co2 for r in readings) / len(readings)
        avg_temp = sum(r.temperature for r in readings) / len(readings)
        avg_humidity = sum(r.humidity for r in readings) / len(readings)
        
        return jsonify({
            'avgCo2': round(avg_co2, 2),
            'avgTemperature': round(avg_temp, 2),
            'avgHumidity': round(avg_humidity, 2),
            'totalReadings': len(readings)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@readings_bp.route('/external/<sensor_api_key>', methods=['POST'])
def add_external_reading(sensor_api_key):
    """
    External endpoint for real sensors (SDC30, etc.) to push data.
    This endpoint uses API key auth instead of JWT for IoT devices.
    The sensor_api_key is the sensor ID for now (can be enhanced with API keys later)
    """
    try:
        data = request.get_json()
        
        co2 = data.get('co2')
        temperature = data.get('temperature')
        humidity = data.get('humidity')
        
        if co2 is None or temperature is None or humidity is None:
            return jsonify({'error': 'co2, temperature, and humidity are required'}), 400
        
        # Find sensor by ID (treating api_key as sensor_id for simplicity)
        try:
            sensor_id = int(sensor_api_key)
        except ValueError:
            return jsonify({'error': 'Invalid sensor identifier'}), 400
            
        sensor = Sensor.query.get(sensor_id)
        
        if not sensor:
            return jsonify({'error': 'Sensor not found'}), 404
        
        # Only allow real sensors to use this endpoint
        if sensor.sensor_type != 'real':
            return jsonify({'error': 'This endpoint is only for real sensors'}), 403
        
        new_reading = SensorReading(
            sensor_id=sensor_id,
            co2=float(co2),
            temperature=float(temperature),
            humidity=float(humidity)
        )
        
        db.session.add(new_reading)
        
        # Update sensor status based on CO2 levels
        if co2 > 1200:
            sensor.status = 'avertissement'
        elif co2 > 1000:
            sensor.status = 'avertissement'
        else:
            sensor.status = 'en ligne'
        
        sensor.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Reading recorded successfully',
            'reading': new_reading.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@readings_bp.route('/latest/<int:sensor_id>', methods=['GET'])
@jwt_required()
def get_latest_reading(sensor_id):
    """Get the latest reading for a specific sensor"""
    try:
        current_user_id = get_jwt_identity()
        
        # Convert to int if string
        if isinstance(current_user_id, str):
            current_user_id = int(current_user_id)
            
        user = User.query.get(current_user_id)
        
        sensor = Sensor.query.get(sensor_id)
        
        if not sensor:
            return jsonify({'error': 'Sensor not found'}), 404
        
        # Check ownership unless admin
        if user.role != 'admin' and sensor.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized access to this sensor'}), 403
        
        # Get latest reading
        latest_reading = SensorReading.query.filter_by(
            sensor_id=sensor_id
        ).order_by(SensorReading.recorded_at.desc()).first()
        
        if not latest_reading:
            return jsonify({'error': 'No readings found for this sensor'}), 404
        
        return jsonify({
            'reading': latest_reading.to_dict(),
            'sensor': sensor.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
