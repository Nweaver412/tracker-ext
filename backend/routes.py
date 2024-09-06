from flask import Blueprint, request, jsonify, render_template
from .models import add_habit, get_all_habits
from .config import Config
from .utils import log_sync
import json

main = Blueprint('main', __name__)

@main.route('/sync', methods=['POST'])
def sync():
    data = request.json
    rows_added = 0
    for habit in data['habits']:
        add_habit(habit['type'], habit['timestamp'], json.dumps(habit))
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