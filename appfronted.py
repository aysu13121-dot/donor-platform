from flask import Flask, render_template, request, jsonify
import database

app = Flask(__name__)
database.init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/stats', methods=['GET'])
def stats():
    return jsonify(database.get_platform_stats())

@app.route('/api/donors', methods=['GET'])
def donors():
    b_type = request.args.get('blood_type')
    city = request.args.get('city')
    avail = request.args.get('is_available')
    avail = int(avail) if avail is not None else None
    return jsonify(database.get_all_donors(blood_type=b_type, city=city, is_available=avail))

@app.route('/api/requests', methods=['GET', 'POST'])
def handle_requests():
    if request.method == 'GET':
        b_type = request.args.get('blood_type')
        city = request.args.get('city')
        urgency = request.args.get('urgency')
        return jsonify(database.get_blood_requests(blood_type=b_type, city=city, urgency=urgency))
    elif request.method == 'POST':
        data = request.json or {}
        req = database.create_blood_request(
            user_id=data.get('user_id'),
            patient_name=data.get('patient_name'),
            blood_type=data.get('blood_type'),
            hospital=data.get('hospital'),
            city=data.get('city'),
            units_needed=int(data.get('units_needed', 1)),
            urgency=data.get('urgency', 'Urgent'),
            contact_phone=data.get('contact_phone'),
            note=data.get('note')
        )
        return jsonify(req), 201

@app.route('/api/requests/<int:req_id>/offers', methods=['POST'])
def offers(req_id):
    data = request.json or {}
    offer_id = database.create_donation_offer(req_id, data.get('donor_id'), data.get('message'))
    return jsonify({'id': offer_id, 'message': 'Müraciətiniz göndərildi'})

@app.route('/api/auth/register', methods=['POST'])
def register():
    d = request.json or {}
    u = database.create_user(d['email'], d['password'], d.get('full_name'), d.get('blood_type'), d.get('city'), d.get('phone'), bio=d.get('bio'))
    if not u:
        return jsonify({'error': 'E-poçt artıq mövcuddur'}), 400
    return jsonify(u), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    d = request.json or {}
    u = database.get_user_by_email(d['email'])
    if not u or not database.verify_password(u['password_hash'], d['password']):
        return jsonify({'error': 'E-poçt və ya şifrə yanlışdır'}), 401
    u.pop('password_hash', None)
    return jsonify(u)

@app.route('/api/profile/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    d = request.json or {}
    u = database.update_user_profile(
        user_id, d.get('full_name'), d.get('blood_type'), d.get('city'),
        d.get('phone'), d.get('is_available'), d.get('last_donation_date'), d.get('bio')
    )
    if u: u.pop('password_hash', None)
    return jsonify(u)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
