from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()

def create_app(config_name=None):
    app = Flask(__name__)
    CORS(app)

    # Load configuration
    from .config import config
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # Configure upload folder
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads/profile_photos')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Configure JWT
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1 hour
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 604800  # 1 week

    # Configure Mail
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)

    # Import and register blueprints
    from .routes import app as routes_blueprint
    from .user_routes import app as user_routes_blueprint
    from .auth_routes import app as auth_routes_blueprint
    app.register_blueprint(routes_blueprint)
    app.register_blueprint(user_routes_blueprint)
    app.register_blueprint(auth_routes_blueprint)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000) 