import bcrypt
from flask import Flask, request, jsonify
from gradescopeapi.classes.connection import GSConnection
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId

app = Flask(__name__)

uri = "mongodb+srv://mohammedamin:Wu0p2cOt41evliql@betsmart.l7eyf.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client.betsmartAuth
users_collection = db.users
wagers_collection = db.wagers

def gradescope_login(email, password):
    connection = GSConnection()
    connection.login(email, password)
    return connection

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

@app.route('/gradescopeAuth', methods=['POST'])
def gradescope_auth():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', '')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        user = users_collection.find_one({"email": email})
        if user:
            if not verify_password(password, user["password"]):
                return jsonify({"error": "Invalid password"}), 401
            return jsonify({"message": "Logged in successfully!"}), 200

        hashed_password = hash_password(password)
        users_collection.insert_one({
            "email": email,
            "name": name,
            "password": hashed_password,
            "activeWagers": [],
            "pastWagers": [],
            "balance": 0,
            "pendingInvitations": []
        })
        return jsonify({"message": "New user registered and logged in successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/getActiveWagers', methods=['GET'])
def get_active_wagers():
    email = request.args.get('email')
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404
    active_wagers = wagers_collection.find({"_id": {"$in": user['activeWagers']}})
    return jsonify({"activeWagers": list(active_wagers)}), 200

@app.route('/acceptInvite', methods=['POST'])
def accept_invite():
    data = request.json
    email = data.get('email')
    wager_id = data.get('wagerId')

    if not email or not wager_id:
        return jsonify({"error": "Email and wagerId are required"}), 400
    try:
        wager_id = ObjectId(wager_id)
    except:
        return jsonify({"error": "Invalid wagerId format"}), 400

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    wager = wagers_collection.find_one({"_id": wager_id, "active": True})
    if not wager:
        return jsonify({"error": "Wager not found or is no longer active"}), 404

    if wager_id not in user.get('pendingInvitations', []):
        return jsonify({"error": "Wager not found in user's pending invitations"}), 400
    
    users_collection.update_one(
        {"email": email},
        {
            "$pull": {"pendingInvitations": wager_id},
            "$push": {"activeWagers": wager_id}
        }
    )

    wagers_collection.update_one(
        {"_id": wager_id},
        {
            "$push": {"activeParticipants": user["_id"]},
            "$pull": {"pendingParticipants": email}
        }
    )

    return jsonify({"message": "Invitation accepted successfully"}), 200


@app.route('/rejectInvite', methods=['POST'])
def reject_invite():
    data = request.json
    email = data.get('email')
    wager_id = data.get('wagerId')

    if not email or not wager_id:
        return jsonify({"error": "Email and wagerId are required"}), 400

    try:
        wager_id = ObjectId(wager_id)
    except:
        return jsonify({"error": "Invalid wagerId format"}), 400

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    wager = wagers_collection.find_one({"_id": wager_id, "active": True})
    if not wager:
        return jsonify({"error": "Wager not found or is no longer active"}), 404

    if wager_id not in user.get('pendingInvitations', []):
        return jsonify({"error": "Wager not found in user's pending invitations"}), 400
    
    users_collection.update_one(
        {"email": email},
        {"$pull": {"pendingInvitations": wager_id}}
    )

    wagers_collection.update_one(
        {"_id": wager_id},
        {"$pull": {"pendingParticipants": email}}
    )

    return jsonify({"message": "Invitation rejected successfully"}), 200


@app.route('/expireWager', methods=['POST'])
def expire_wager():
    data = request.json
    wager_id = data.get('wagerId')
    wager = wagers_collection.find_one({"_id": wager_id})

    if not wager or not wager['active']:
        return jsonify({"error": "Wager not found or already expired"}), 404

    participants = wager['activeParticipants']
    grades = []
    for participant_id in participants:
        user = users_collection.find_one({"_id": participant_id})
        if user:
      
            connection = gradescope_login(user['email'], user['password'])
            assignments = connection.account.get_assignments(wager['class'])
            for assignment in assignments:
                if assignment.name == wager['assignment']:
                    grades.append({"user_id": participant_id, "grade": assignment.grade})


    if grades:
        winner = max(grades, key=lambda x: x['grade'])
        users_collection.update_one(
            {"_id": winner['user_id']},
            {
                "$inc": {"balance": wager['prize']},
                "$push": {"pastWagers": wager_id}
            }
        )

    wagers_collection.update_one({"_id": wager_id}, {"$set": {"active": False}})
    return jsonify({"message": "Wager expired successfully"}), 200

@app.route('/createWager', methods=['POST'])
def create_wager():
    data = request.json
    pending_participants = data.get('pendingParticipants', [])

    users = users_collection.find({"email": {"$in": pending_participants}})
    user_emails = [user['email'] for user in users]

    if not user_emails:
        return jsonify({"error": "No valid participants found in the database"}), 400

    wager_data = {
        "class": data.get('class'),
        "assignment": data.get('assignment'),
        "semester": data.get('semester'),
        "entryAmount": data.get('entryAmount'),
        "prize": data.get('prize'),
        "imageId": data.get('imageId'),
        "activeParticipants": [],
        "pendingParticipants": user_emails,
        "endTime": data.get('endTime'),
        "active": True,
        "winner": ""
    }

    wager_id = wagers_collection.insert_one(wager_data).inserted_id

    users_collection.update_many(
        {"email": {"$in": user_emails}},
        {"$push": {"pendingInvitations": wager_id}}
    )

    return jsonify({"message": "Wager created successfully", "wagerId": str(wager_id)}), 200


@app.route('/getPastWagers', methods=['GET'])
def get_past_wagers():
    email = request.args.get('email')
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    past_wagers = wagers_collection.find({"_id": {"$in": user['pastWagers']}})
    return jsonify({"pastWagers": list(past_wagers)}), 200

@app.route('/getTotalEarnings', methods=['GET'])
def get_total_earnings():
    email = request.args.get('email')
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    total_earnings = sum(wager['prize'] for wager in wagers_collection.find({"_id": {"$in": user['pastWagers']}}))
    return jsonify({"totalEarnings": total_earnings}), 200

if __name__ == "__main__":
    app.run(debug=True)
