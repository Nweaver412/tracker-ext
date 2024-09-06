from flask import Blueprint, request, jsonify, render_template
from .models import add_habit, get_all_habits
from .utils import log_sync
from .config import Config 
import json
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/sync', methods=['POST'])
def sync():
    data = request.json
    rows_added = 0
    for habit in data['habits']:
        habit_type = habit['type']
        timestamp = habit['timestamp']
        
        if habit_type == 'sleep':
            # For sleep, we use the date provided and set the time to midnight
            date = datetime.strptime(habit['date'], '%Y-%m-%d').replace(hour=0, minute=0, second=0, microsecond=0)
            timestamp = date.isoformat()
        
        habit_data = json.dumps(habit)
        add_habit(habit_type, timestamp, habit_data)
        rows_added += 1
    
    log_sync(rows_added)
    
    return jsonify({"status": "success", "message": f"{rows_added} habits synced"})

@main.route('/view_data', methods=['GET'])
def view_data():
    habits = get_all_habits()
    return render_template('view_data.html', habits=habits)

@main.route('/view_log', methods=['GET'])
def view_log():
    with open(Config.LOG_PATH, 'r') as log_file:
        log_contents = log_file.read()
    return render_template('view_log.html', log_contents=log_contents)