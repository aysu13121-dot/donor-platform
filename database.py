import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            blood_type TEXT,
            city TEXT,
            phone TEXT,
            role TEXT DEFAULT 'donor',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()

    count = cursor.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    if count == 0:
        seed_donors = [
            ("leyla@example.com", "password123", "Leyla Məmmədova", "A+", "Bakı", "+994501112233", "donor"),
            ("elvin@example.com", "password123", "Elvin Əliyev", "O+", "Gəncə", "+994552223344", "donor"),
            ("nigar@example.com", "password123", "Nigar Həsənova", "B+", "Sumqayıt", "+994703334455", "donor"),
            ("resad@example.com", "password123", "Rəşad Quliyev", "AB-", "Bakı", "+994504445566", "donor"),
            ("aynur@example.com", "password123", "Aynur Hüseynova", "O-", "Naxçıvan", "+994515556677", "donor")
        ]
        for email, pw, name, b_type, city, phone, role in seed_donors:
            hashed = generate_password_hash(pw)
            cursor.execute('''
                INSERT INTO users (email, password_hash, full_name, blood_type, city, phone, role)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (email, hashed, name, b_type, city, phone, role))
        conn.commit()

    conn.close()

def create_user(email, password, full_name=None, blood_type=None, city=None, phone=None, role='donor'):
    conn = get_db_connection()
    cursor = conn.cursor()
    hashed_pw = generate_password_hash(password)
    try:
        cursor.execute('''
            INSERT INTO users (email, password_hash, full_name, blood_type, city, phone, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (email, hashed_pw, full_name, blood_type, city, phone, role))
        conn.commit()
        user_id = cursor.lastrowid
        return get_user_by_id(user_id)
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def get_user_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    if user:
        return dict(user)
    return None

def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    if user:
        return dict(user)
    return None

def get_all_donors(blood_type=None, city=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT id, email, full_name, blood_type, city, phone, role, created_at FROM users WHERE role = 'donor'"
    params = []

    if blood_type:
        query += " AND blood_type = ?"
        params.append(blood_type)
    if city:
        query += " AND city = ?"
        params.append(city)

    donors = cursor.execute(query, params).fetchall()
    conn.close()
    return [dict(d) for d in donors]

def verify_password(stored_hash, password):
    return check_password_hash(stored_hash, password)
