from flask import Flask
from extensions import db, bcrypt, jwt, migrate, mail  # Add mail to imports
from datetime import timedelta
from views import *
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///moringa_pair.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'supersecretkey'
    app.config['JWT_SECRET_KEY'] = 'anothersecret'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    
    # Email configuration
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Using Gmail as example
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'kelvin.ndunda1@student.moringaschool.com'
    app.config['MAIL_PASSWORD'] = 'npcu bvst xdbr skvi'
    app.config['MAIL_DEFAULT_SENDER'] = 'kelvin.ndunda1@student.moringaschool.com'
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)  # Initialize mail
    
    # Register blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(quizzes_bp)
    app.register_blueprint(pairs_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(learning_pref_bp)
    
    @app.route('/')
    def home():
        return {'message': 'MoringaPair API is running'}
    
    return app

app = create_app()