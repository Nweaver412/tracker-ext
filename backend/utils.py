from datetime import datetime
from flask import current_app

def log_sync(rows_added):
    with open(current_app.config['LOG_PATH'], 'a') as log_file:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_file.write(f"{timestamp}: {rows_added} rows added to the database\n")