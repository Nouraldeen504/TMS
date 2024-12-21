from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import init_db
from routes import auth_routes

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    init_db(app)
    
    app.config['JWT_SECRET_KEY'] = 'dev_secret_key_change_in_production'
    JWTManager(app)
    
    app.register_blueprint(auth_routes, url_prefix='/auth')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)