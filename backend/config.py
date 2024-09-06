import os

class Config:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATABASE_PATH = os.path.join(BASE_DIR, 'data', 'habits.db')
    LOG_PATH = os.path.join(BASE_DIR, 'logs', 'sync_log.txt')

    @staticmethod
    def init_app(app):
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(Config.DATABASE_PATH), exist_ok=True)
        os.makedirs(os.path.dirname(Config.LOG_PATH), exist_ok=True)