from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/")
def home():
    return "Salam! Bu bizim Donor tapma layihemizin backend-idir."

@app.route("/api/donors", methods=["GET"])
def get_donors():
    donors = [
        {"id": 1, "name": "Aysu", "blood_type": "A+"},
        {"id": 2, "name": "Amin", "blodd_type": "O-"}
    ]
    return jsonify(donors)
@app.route("/api/signup", methods=["POST"])
def singup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    return jsonify({"message": f"{name} ugurla qeydiyyatdan kecdi!", "email": email})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
