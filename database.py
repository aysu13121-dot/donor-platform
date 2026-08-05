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
    
    # 1. Users table
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
            is_available INTEGER DEFAULT 1,
            last_donation_date TEXT,
            bio TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Schema migration helper
    cursor.execute("PRAGMA table_info(users)")
    existing_cols = [col['name'] for col in cursor.fetchall()]
    if 'is_available' not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN is_available INTEGER DEFAULT 1")
    if 'last_donation_date' not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN last_donation_date TEXT")
    if 'bio' not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN bio TEXT")

    # 2. Blood Requests table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS blood_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            patient_name TEXT NOT NULL,
            blood_type TEXT NOT NULL,
            hospital TEXT NOT NULL,
            city TEXT NOT NULL,
            units_needed INTEGER DEFAULT 1,
            urgency TEXT DEFAULT 'Urgent',
            contact_phone TEXT NOT NULL,
            note TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')

    # 3. Donation Offers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS donation_offers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id INTEGER NOT NULL,
            donor_id INTEGER NOT NULL,
            message TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (request_id) REFERENCES blood_requests (id) ON DELETE CASCADE,
            FOREIGN KEY (donor_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')

    conn.commit()

    # Initial seed data if database is empty
    count = cursor.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    if count == 0:
        seed_donors = [
            ("leyla@example.com", "password123", "Leyla Məmmədova", "A+", "Bakı", "+994501112233", "donor", 1, "2026-05-10", "Tez-tez qan verirəm, kömək etməyə hazıram."),
            ("elvin@example.com", "password123", "Elvin Əliyev", "O+", "Gəncə", "+994552223344", "donor", 1, "2026-03-15", "Təcili hallarda müraciət edə bilərsiniz."),
            ("nigar@example.com", "password123", "Nigar Həsənova", "B+", "Sumqayıt", "+994703334455", "donor", 1, "2026-06-01", "Hər zaman aktiv donoram."),
            ("resad@example.com", "password123", "Rəşad Quliyev", "AB-", "Bakı", "+994504445566", "donor", 1, "2026-01-20", "Nadir qan qrupu donoruyam.")
        ]
        for email, pw, name, b_type, city, phone, role, is_avail, last_don, bio in seed_donors:
            hashed = generate_password_hash(pw)
            cursor.execute('''
                INSERT INTO users (email, password_hash, full_name, blood_type, city, phone, role, is_available, last_donation_date, bio)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (email, hashed, name, b_type, city, phone, role, is_avail, last_don, bio))
        conn.commit()

        # Seed requests
        seed_requests = [
            (1, "Kərimov Fərid", "A+", "Mərkəzi Qan Bankı", "Bakı", 2, "Urgent", "+994501112233", "Təcili cərrahiyyə əməliyyatı üçün qan lazımdır.", "active"),
            (2, "Məmmədov Vüqar", "O-", "Gəncə Şəhər Xəstəxanası", "Gəncə", 1, "Urgent", "+994552223344", "Təcili O- donor axtarılır.", "active")
        ]
        for u_id, p_name, b_type, hosp, city, units, urg, phone, note, status in seed_requests:
            cursor.execute('''
                INSERT INTO blood_requests (user_id, patient_name, blood_type, hospital, city, units_needed, urgency, contact_phone, note, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (u_id, p_name, b_type, hosp, city, units, urg, phone, note, status))
        conn.commit()

    conn.close()

def create_user(email, password, full_name=None, blood_type=None, city=None, phone=None, role='donor', is_available=1, bio=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    hashed_pw = generate_password_hash(password)
    try:
        cursor.execute('''
            INSERT INTO users (email, password_hash, full_name, blood_type, city, phone, role, is_available, bio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (email, hashed_pw, full_name, blood_type, city, phone, role, is_available, bio))
        conn.commit()
        user_id = cursor.lastrowid
        return get_user_by_id(user_id)
    except sqlite3.IntegrityError:
        conn.close()
        return None
    finally:
        conn.close()

def get_user_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    return dict(user) if user else None

def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return dict(user) if user else None

def update_user_profile(user_id, full_name=None, blood_type=None, city=None, phone=None, is_available=None, last_donation_date=None, bio=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = get_user_by_id(user_id)
    if not user:
        conn.close()
        return None

    new_name = full_name if full_name is not None else user['full_name']
    new_blood = blood_type if blood_type is not None else user['blood_type']
    new_city = city if city is not None else user['city']
    new_phone = phone if phone is not None else user['phone']
    new_avail = is_available if is_available is not None else user['is_available']
    new_date = last_donation_date if last_donation_date is not None else user['last_donation_date']
    new_bio = bio if bio is not None else user['bio']

    cursor.execute('''
        UPDATE users
        SET full_name = ?, blood_type = ?, city = ?, phone = ?, is_available = ?, last_donation_date = ?, bio = ?
        WHERE id = ?
    ''', (new_name, new_blood, new_city, new_phone, new_avail, new_date, new_bio, user_id))
    conn.commit()
    conn.close()
    return get_user_by_id(user_id)

def _donor_filters_clause(blood_type=None, city=None, is_available=None):
    clause = " WHERE role = 'donor'"
    params = []
    if blood_type:
        clause += " AND blood_type = ?"
        params.append(blood_type)
    if city:
        clause += " AND city = ?"
        params.append(city)
    if is_available is not None:
        clause += " AND is_available = ?"
        params.append(1 if is_available else 0)
    return clause, params

def delete_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted

def get_all_donors(blood_type=None, city=None, is_available=None, limit=None, offset=0):
    conn = get_db_connection()
    cursor = conn.cursor()
    clause, params = _donor_filters_clause(blood_type, city, is_available)
    query = ("SELECT id, email, full_name, blood_type, city, phone, role, is_available, "
              "last_donation_date, bio, created_at FROM users") + clause + " ORDER BY id DESC"
    if limit is not None:
        query += " LIMIT ? OFFSET ?"
        params = params + [limit, offset]
    donors = cursor.execute(query, params).fetchall()
    conn.close()
    return [dict(d) for d in donors]

def count_donors(blood_type=None, city=None, is_available=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    clause, params = _donor_filters_clause(blood_type, city, is_available)
    total = cursor.execute("SELECT COUNT(*) FROM users" + clause, params).fetchone()[0]
    conn.close()
    return total

def verify_password(stored_hash, password):
    return check_password_hash(stored_hash, password)

def create_blood_request(user_id, patient_name, blood_type, hospital, city, units_needed=1, urgency='Urgent', contact_phone=None, note=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO blood_requests (user_id, patient_name, blood_type, hospital, city, units_needed, urgency, contact_phone, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, patient_name, blood_type, hospital, city, units_needed, urgency, contact_phone, note))
    conn.commit()
    req_id = cursor.lastrowid
    conn.close()
    return get_blood_request_by_id(req_id)

def get_blood_requests(blood_type=None, city=None, urgency=None, status=None, user_id=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = '''
        SELECT br.*, u.full_name as author_name, u.email as author_email
        FROM blood_requests br
        JOIN users u ON br.user_id = u.id
        WHERE 1=1
    '''
    params = []
    if status:
        query += " AND br.status = ?"
        params.append(status)
    if blood_type:
        query += " AND br.blood_type = ?"
        params.append(blood_type)
    if city:
        query += " AND br.city = ?"
        params.append(city)
    if urgency:
        query += " AND br.urgency = ?"
        params.append(urgency)
    if user_id:
        query += " AND br.user_id = ?"
        params.append(user_id)

    query += " ORDER BY br.created_at DESC"
    requests = cursor.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in requests]

def get_blood_request_by_id(request_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    req = cursor.execute('SELECT br.*, u.full_name as author_name FROM blood_requests br JOIN users u ON br.user_id = u.id WHERE br.id = ?', (request_id,)).fetchone()
    conn.close()
    return dict(req) if req else None

def update_blood_request(request_id, user_id, patient_name=None, blood_type=None, hospital=None, city=None,
                          units_needed=None, urgency=None, contact_phone=None, note=None, status=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    existing = get_blood_request_by_id(request_id)
    if not existing or existing['user_id'] != user_id:
        conn.close()
        return None

    p_name = patient_name if patient_name is not None else existing['patient_name']
    b_type = blood_type if blood_type is not None else existing['blood_type']
    hosp = hospital if hospital is not None else existing['hospital']
    c_city = city if city is not None else existing['city']
    units = units_needed if units_needed is not None else existing['units_needed']
    urg = urgency if urgency is not None else existing['urgency']
    phone = contact_phone if contact_phone is not None else existing['contact_phone']
    nt = note if note is not None else existing['note']
    st = status if status is not None else existing['status']

    cursor.execute('''
        UPDATE blood_requests
        SET patient_name = ?, blood_type = ?, hospital = ?, city = ?, units_needed = ?,
            urgency = ?, contact_phone = ?, note = ?, status = ?
        WHERE id = ? AND user_id = ?
    ''', (p_name, b_type, hosp, c_city, units, urg, phone, nt, st, request_id, user_id))
    conn.commit()
    conn.close()
    return get_blood_request_by_id(request_id)

def delete_blood_request(request_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM blood_requests WHERE id = ? AND user_id = ?', (request_id, user_id))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted

def create_donation_offer(request_id, donor_id, message=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO donation_offers (request_id, donor_id, message) VALUES (?, ?, ?)', (request_id, donor_id, message))
    conn.commit()
    offer_id = cursor.lastrowid
    conn.close()
    return offer_id
def get_offers_for_request(request_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    offers = cursor.execute('''
        SELECT do.*, u.full_name as donor_name, u.blood_type, u.city, u.phone
        FROM donation_offers do
        JOIN users u ON do.donor_id = u.id
        WHERE do.request_id = ?
        ORDER BY do.created_at DESC
    ''', (request_id,)).fetchall()
    conn.close()
    return [dict(o) for o in offers]

def get_platform_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    total_donors = cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'donor'").fetchone()[0]
    active_donors = cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'donor' AND is_available = 1").fetchone()[0]
    active_requests = cursor.execute("SELECT COUNT(*) FROM blood_requests WHERE status = 'active'").fetchone()[0]
    fulfilled_requests = cursor.execute("SELECT COUNT(*) FROM blood_requests WHERE status = 'fulfilled'").fetchone()[0]
    total_cities = cursor.execute("SELECT COUNT(DISTINCT city) FROM users WHERE city IS NOT NULL AND city != ''").fetchone()[0]
    conn.close()
    return {
        'total_donors': total_donors,
        'active_donors': active_donors,
        'active_requests': active_requests,
        'fulfilled_requests': fulfilled_requests,
        'total_cities': max(total_cities, 3)
    }
