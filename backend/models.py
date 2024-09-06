import sqlite3
from flask import current_app

def get_db_connection():
    conn = sqlite3.connect(current_app.config['DATABASE_PATH'])
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS habits
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  type TEXT,
                  timestamp TEXT,
                  data TEXT)''')
    conn.commit()
    conn.close()

def add_habit(habit_type, timestamp, data):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO habits (type, timestamp, data) VALUES (?, ?, ?)",
              (habit_type, timestamp, data))
    conn.commit()
    conn.close()

def get_all_habits():
    conn = get_db_connection()
    habits = conn.execute('SELECT * FROM habits').fetchall()
    conn.close()
    return habits