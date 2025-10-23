from flask import Flask
from flask_cors import CORS
import config
from database.db import init_db

def create_app():
    """Application factory pattern for Flask app"""
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config)

    # Enable CORS
    CORS(app, origins=config.CORS_ORIGINS)

    # Initialize database
    init_db()

    # Register blueprints
    from routes.caption import caption_bp
    from routes.rating import rating_bp
    from routes.history import history_bp

    app.register_blueprint(caption_bp, url_prefix='/api')
    app.register_blueprint(rating_bp, url_prefix='/api')
    app.register_blueprint(history_bp, url_prefix='/api')

    @app.route('/health')
    def health():
        """Health check endpoint"""
        return {'status': 'healthy'}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=config.DEBUG
    )
