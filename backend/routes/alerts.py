from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db, Alert, Sensor, User
from datetime import datetime

alerts_bp = Blueprint('alerts', __name__)

@alerts_bp.route('', methods=['GET'])
@jwt_required()
def get_alerts():
    """Get alerts for the current user"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get query parameters
        status = request.args.get('status')  # 'nouvelle', 'reconnue', 'résolue'
        limit = request.args.get('limit', 50, type=int)
        
        # Build query
        if user.role == 'admin':
            query = Alert.query
        else:
            query = Alert.query.filter_by(user_id=current_user_id)
        
        # Filter by status if provided
        if status:
            query = query.filter_by(status=status)
        
        # Get alerts ordered by most recent first
        alerts = query.order_by(Alert.created_at.desc()).limit(limit).all()
        
        return jsonify({
            'alerts': [alert.to_dict() for alert in alerts]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@alerts_bp.route('/<int:alert_id>', methods=['PUT'])
@jwt_required()
def update_alert_status(alert_id):
    """Update alert status"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        alert = Alert.query.get(alert_id)
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        # Check ownership unless admin
        if user.role != 'admin' and alert.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized access to this alert'}), 403
        
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['nouvelle', 'reconnue', 'résolue']:
            return jsonify({'error': 'Invalid status'}), 400
        
        alert.status = new_status
        db.session.commit()
        
        return jsonify({
            'message': 'Alert status updated successfully',
            'alert': alert.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@alerts_bp.route('/<int:alert_id>', methods=['DELETE'])
@jwt_required()
def delete_alert(alert_id):
    """Delete an alert"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        alert = Alert.query.get(alert_id)
        
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        # Check ownership unless admin
        if user.role != 'admin' and alert.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized access to this alert'}), 403
        
        db.session.delete(alert)
        db.session.commit()
        
        return jsonify({'message': 'Alert deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
