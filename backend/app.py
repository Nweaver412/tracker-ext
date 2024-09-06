from flask import Flask
from flask_cors import CORS
from .config import Config
from .routes import main
from .models import init_db

app = Flask(__name__)
app.config.from_object(Config)
Config.init_app(app)
CORS(app)

app.register_blueprint(main)

with app.app_context():
    init_db()

if __name__ == '__main__':
    app.run(debug=True)