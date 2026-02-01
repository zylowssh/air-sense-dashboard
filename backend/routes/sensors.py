from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db, Sensor, SensorReading, User
from datetime import datetime

sensors_bp = Blueprint('sensors', __name__)

@sensors_bp.route('', methods=['GET'])
@jwt_required()
def get_sensors():
    """Get all sensors for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Convert to int if string
        if isinstance(current_user_id, str):
            current_user_id = int(current_user_id)
            
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Admin can see all sensors, regular users only their own
        if user.role == 'admin':
            sensors = Sensor.query.all()
        else:
            sensors = Sensor.query.filter_by(user_id=current_user_id).all()
        
        # Include latest readings for each sensor
        sensors_data = [sensor.to_dict(include_latest_reading=True) for sensor in sensors]
        
        return jsonify({'sensors': sensors_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sensors_bp.route('/<int:sensor_id>', methods=['GET'])
@jwt_required()
def get_sensor(sensor_id):
    """Get a specific sensor by ID"""
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
        
        return jsonify({'sensor': sensor.to_dict(include_latest_reading=True)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sensors_bp.route('', methods=['POST'])
@jwt_required()
def create_sensor():
    """Create a new sensor"""
    try:
        current_user_id = get_jwt_identity()
        
        # Convert to int if string
        if isinstance(current_user_id, str):
            current_user_id = int(current_user_id)
            
        data = request.get_json()
        
        name = data.get('name')
        location = data.get('location')
        sensor_type = data.get('sensor_type', 'simulation')
        
        if not name or not location:
            return jsonify({'error': 'Name and location are required'}), 400
        
        new_sensor = Sensor(
            user_id=current_user_id,
            name=name,
            location=location,
            sensor_type=sensor_type,
            status='en ligne',
            battery=100,
            is_live=True
        )
        
        db.session.add(new_sensor)
        db.session.commit()
        
        return jsonify({
            'message': 'Sensor created successfully',
            'sensor': new_sensor.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@sensors_bp.route('/<int:sensor_id>', methods=['PUT'])
@jwt_required()
def update_sensor(sensor_id):
    """Update a sensor"""
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
        
        data = request.get_json()
        
        if 'name' in data:
            sensor.name = data['name']
        if 'location' in data:
            sensor.location = data['location']
        if 'sensor_type' in data:
            sensor.sensor_type = data['sensor_type']
        if 'status' in data:
            sensor.status = data['status']
        if 'battery' in data:
            sensor.battery = data['battery']
        if 'is_live' in data:
            sensor.is_live = data['is_live']
        
        sensor.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Sensor updated successfully',
            'sensor': sensor.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@sensors_bp.route('/<int:sensor_id>', methods=['DELETE'])
@jwt_required()
def delete_sensor(sensor_id):
    """Delete a sensor"""
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
        
        db.session.delete(sensor)
        db.session.commit()
        
        return jsonify({'message': 'Sensor deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
