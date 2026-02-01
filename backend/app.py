from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from datetime import timedelta
from dotenv import load_dotenv
import os
import logging
from logging.handlers import RotatingFileHandler

from database import db, init_db
from routes.auth import auth_bp
from routes.sensors import sensors_bp
from routes.readings import readings_bp
from routes.users import users_bp
from routes.alerts import alerts_bp
from routes.reports import reports_bp
from scheduler import init_scheduler
from email_service import init_email
from config import Config

load_dotenv()

# Configure logging
def setup_logging(app):
    """Setup application logging"""
    if not app.config.get('DEBUG'):
        if not os.path.exists('logs'):
            os.mkdir('logs')
        
        file_handler = RotatingFileHandler(
            'logs/aerium.log',
            maxBytes=10240000,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Aerium Air Quality Dashboard startup')


def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'aerium-dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///aerium.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    
    # Email configuration
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@airsense.app')
    
    # Feature flags
    app.config['ENABLE_EMAIL_NOTIFICATIONS'] = os.getenv('ENABLE_EMAIL_NOTIFICATIONS', 'True') == 'True'
    app.config['ENABLE_RATE_LIMITING'] = os.getenv('ENABLE_RATE_LIMITING', 'True') == 'True'
    app.config['FRONTEND_URL'] = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    
    # Setup logging
    setup_logging(app)
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    init_email(app)
    
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:8080", "http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize rate limiter
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"] if app.config.get('ENABLE_RATE_LIMITING') else []
    )
    
    # Initialize caching
    cache = Cache(app, config={
        'CACHE_TYPE': 'simple',
        'CACHE_DEFAULT_TIMEOUT': 300
    })
    
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading', logger=False, engineio_logger=False)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(sensors_bp, url_prefix='/api/sensors')
    app.register_blueprint(readings_bp, url_prefix='/api/readings')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(alerts_bp, url_prefix='/api/alerts')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Aerium API is running',
            'features': {
                'email_notifications': app.config.get('ENABLE_EMAIL_NOTIFICATIONS', False),
                'rate_limiting': app.config.get('ENABLE_RATE_LIMITING', False)
            }
        }), 200
    
    # API documentation endpoint
    @app.route('/api/docs')
    def api_docs():
        return jsonify({
            'api_version': '1.0.0',
            'title': 'Aerium Air Quality Dashboard API',
            'description': 'REST API for real-time air quality monitoring',
            'endpoints': {
                'auth': '/api/auth - Authentication endpoints',
                'sensors': '/api/sensors - Sensor management',
                'readings': '/api/readings - Sensor readings',
                'alerts': '/api/alerts - Alert management',
                'users': '/api/users - User management',
                'reports': '/api/reports - Reports generation'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f'Server error: {error}')
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({'error': 'Rate limit exceeded. Try again later.'}), 429
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization token is missing'}), 401
    
    # Initialize database
    with app.app_context():
        init_db()
    
    # Initialize scheduler for sensor simulation
    init_scheduler(app, socketio)
    
    app.logger.info('Aerium app initialized successfully')
    return app, socketio

app, socketio = create_app()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
