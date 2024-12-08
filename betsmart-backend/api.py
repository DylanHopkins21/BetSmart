from cryptography.fernet import Fernet
from flask import Flask, request, jsonify
from gradescopeapi.classes.connection import GSConnection
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
# Explicitly allow cross-origin requests from the frontend domain
CORS(app, origins="http://localhost:3000")  # This allows all routes to accept requests from your frontend



# MongoDB Connection
uri = os.getenv("URI")
client = MongoClient(uri, server_api=ServerApi('1'))
db = client.betsmartAuth
users_collection = db.users
wagers_collection = db.wagers

# Encryption Key
encryption_key = os.getenv("FERNET_KEY")
cipher_suite = Fernet(encryption_key.encode('utf-8'))

# Encryption and Decryption
def encrypt_password(password):
    return cipher_suite.encrypt(password.encode('utf-8')).decode('utf-8')

def decrypt_password(encrypted_password):
    return cipher_suite.decrypt(encrypted_password.encode('utf-8')).decode('utf-8')


def gradescope_login(email, password):
    connection = GSConnection()
    connection.login(email, password)
    return connection

@app.route('/gradescopeAuth', methods=['POST'])
def gradescope_auth():
    """
    Authenticate a Gradescope user.

    If the user exists in the database:
        - Verify their password by decrypting and comparing it.
        - If the password matches, return a successful login message.

    If the user does not exist:
        - Encrypt the password and create a new user entry in the database.
        - Initialize the user with default values such as an empty list of wagers,
          a balance of 0, and an empty list of pending invitations.

    Request JSON:
    {
        "email": "user_email",
        "password": "user_password",
        "name": "user_name"
    }

    Response:
    - Success: 200 or 201 with a message indicating success.
    - Error: 400 for invalid input, 401 for wrong password, or 500 for server error.
    """
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', '')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        user = users_collection.find_one({"email": email})
        if user:
            stored_password = decrypt_password(user["password"])
            if password != stored_password:
                return jsonify({"error": "Invalid password"}), 401
            return jsonify({"message": "Logged in successfully!"}), 200

        encrypted_password = encrypt_password(password)
        users_collection.insert_one({
            "email": email,
            "name": name,
            "password": encrypted_password,
            "activeWagers": [],
            "pastWagers": [],
            "balance": 0,
            "pendingInvitations": []
        })
        return jsonify({"message": "New user registered and logged in successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/acceptInvite', methods=['POST'])
def accept_invite():
    """
    Accept a wager invitation.

    - Validate the provided wager ID and email.
    - Check if the wager exists and is still active.
    - Ensure the user has enough balance to cover the wager entry fee.
    - Update the user's balance, move the wager to their active wagers, 
      and add them to the wager's active participants list.

    Request JSON:
    {
        "email": "user_email",
        "wagerId": "wager_id"
    }

    Response:
    - Success: 200 with a success message.
    - Error: 400 for invalid input or insufficient balance, 404 for missing wager or user.
    """
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

    if user['balance'] < wager['entryAmount']:
        return jsonify({"error": "Insufficient balance"}), 400

    users_collection.update_one(
        {"email": email},
        {
            "$pull": {"pendingInvitations": wager_id},
            "$push": {"activeWagers": wager_id},
            "$inc": {"balance": -wager['entryAmount']}
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
    """
    Reject a wager invitation.

    - Validate the provided wager ID and email.
    - Check if the wager exists and is still active.
    - Remove the wager from the user's pending invitations list.

    Request JSON:
    {
        "email": "user_email",
        "wagerId": "wager_id"
    }

    Response:
    - Success: 200 with a success message.
    - Error: 400 for invalid input, 404 for missing wager or user.
    """
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
    """
    Expire an active wager.

    - Validate the provided wager ID.
    - Check if the wager exists and is still active.
    - Decrypt passwords of participants to log into Gradescope and fetch grades.
    - Determine the winner by finding the participant with the highest grade.
    - Update the winner's balance with total winnings (entry fees + prize money).
    - Move the wager to all participants' past wagers and remove it from active wagers.

    Request JSON:
    {
        "wagerId": "wager_id"
    }

    Response:
    - Success: 200 with winner details and total winnings.
    - Error: 400 for invalid input, 404 for missing or expired wager, or if grades cannot be retrieved.
    """
    data = request.json
    wager_id = data.get('wagerId')

    try:
        wager_id = ObjectId(wager_id)
    except:
        return jsonify({"error": "Invalid wagerId format"}), 400

    wager = wagers_collection.find_one({"_id": wager_id, "active": True})
    if not wager:
        return jsonify({"error": "Wager not found or already expired"}), 404

    course_id = wager.get('courseId')
    assignment_id = wager.get('assignmentId')
    participants = wager['activeParticipants']
    entry_amount = wager.get('entryAmount', 0)
    prize = wager.get('prize', 0)

    if not course_id or not assignment_id:
        return jsonify({"error": "Wager is missing courseId or assignmentId"}), 400

    grades = []

    for participant_id in participants:
        user = users_collection.find_one({"_id": participant_id})
        if not user:
            continue 

        try:
            decrypted_password = decrypt_password(user['password'])
            connection = gradescope_login(user['email'], decrypted_password)
            assignments = connection.account.get_assignments(course_id)

            for assignment in assignments:
                if assignment.id == assignment_id:
                    grades.append({
                        "user_id": participant_id,
                        "email": user["email"],
                        "grade": assignment.grade,
                        "name": user["name"]
                    })
                    break  

        except Exception as e:
            print(f"Error fetching grades for user {user['email']}: {e}")

    if not grades:
        return jsonify({"error": "No grades found for active participants"}), 400

    winner = max(grades, key=lambda x: x['grade'])
    winner_id = winner['user_id']
    winner_name = winner['name']
    winner_email = winner['email']

    total_winnings = entry_amount + prize

    users_collection.update_one(
        {"_id": winner_id},
        {
            "$inc": {"balance": total_winnings},
            "$push": {"pastWagers": wager_id}
        }
    )

    wagers_collection.update_one(
        {"_id": wager_id},
        {"$set": {"active": False, "winner": winner_name}}
    )

    users_collection.update_many(
        {"_id": {"$in": participants}},
        {
            "$push": {"pastWagers": wager_id},
            "$pull": {"activeWagers": wager_id}
        }
    )

    return jsonify({
        "message": "Wager expired successfully",
        "winner": winner_name,
        "winnerEmail": winner_email,
        "totalWinnings": total_winnings
    }), 200





@app.route('/createWager', methods=['POST'])
def create_wager():
    """
    Create a new wager.

    - Validate input fields such as entry amount, course ID, and assignment ID.
    - Verify that all pending participants have sufficient balance for the wager.
    - Deduct the entry amount from participants' balances and move the wager to their pending invitations.

    Request JSON:
    {
        "creatorsEmail": "email"
        "pendingParticipants": ["email1", "email2"],
        "entryAmount": 10,
        "courseId": "course_id",
        "assignmentId": "assignment_id",
        "prize": 50,
        "imageId": "image_id",
        "class": "class_name",
        "assignment": "assignment_name",
        "semester": "Fall 2024",
        "endTime": "2024-12-31T23:59:59Z"
    }

    Response:
    - Success: 200 with a success message and wager ID.
    - Error: 400 for invalid input or insufficient balance, 500 for server errors.
    """
    data = request.json
    creator_email = data.get('creatorEmail')  # Fetch the creator's email
    pending_participants = data.get('pendingParticipants', [])
    entry_amount = data.get('entryAmount')
    course_id = data.get('courseId')
    assignment_id = data.get('assignmentId')

    if not entry_amount or not course_id or not assignment_id or not creator_email:
        return jsonify({"error": "Entry amount, courseId, assignmentId, and creatorEmail are required"}), 400

    try:
        users = list(users_collection.find({"email": {"$in": pending_participants}}))
        valid_users = []
        for user in users:
            if user['balance'] < entry_amount:
                return jsonify({"error": f"User {user['email']} does not have sufficient balance"}), 400
            valid_users.append(user['email'])

        if not valid_users:
            return jsonify({"error": "No valid participants found in the database"}), 400

        users_collection.update_many(
            {"email": {"$in": valid_users}},
            {"$inc": {"balance": -entry_amount}}
        )

        wager_data = {
            "creatorEmail": creator_email,  
            "class": data.get('class'),
            "assignment": data.get('assignment'),
            "courseId": course_id,
            "assignmentId": assignment_id,  
            "semester": data.get('semester'),
            "entryAmount": entry_amount,
            "prize": data.get('prize'),
            "imageId": data.get('imageId'),
            "activeParticipants": [],
            "pendingParticipants": valid_users,
            "endTime": data.get('endTime'),
            "active": True,
            "winner": ""
        }

        wager_id = wagers_collection.insert_one(wager_data).inserted_id
        users_collection.update_many(
            {"email": {"$in": valid_users}},
            {"$push": {"pendingInvitations": wager_id}}
        )

        return jsonify({"message": "Wager created successfully", "wagerId": str(wager_id)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/getPastWagers', methods=['GET'])
def get_past_wagers():
    """
    Retrieve a user's past wagers.

    - Validate the provided email.
    - Query the user's past wagers from the database and return them.

    Request Parameters:
    - email: User's email.

    Response:
    - Success: 200 with a list of past wagers.
    - Error: 404 for missing user.
    """
    email = request.args.get('email')
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    past_wagers = wagers_collection.find({"_id": {"$in": user['pastWagers']}})
    return jsonify({"pastWagers": list(past_wagers)}), 200

@app.route('/getTotalEarnings', methods=['GET'])
def get_total_earnings():
    """
    Calculate a user's total earnings from past wagers.

    - Validate the provided email.
    - Sum the prize money of all wagers in the user's past wagers.

    Request Parameters:
    - email: User's email.

    Response:
    - Success: 200 with the total earnings.
    - Error: 404 for missing user.
    """
    email = request.args.get('email')
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    total_earnings = sum(wager['prize'] for wager in wagers_collection.find({"_id": {"$in": user['pastWagers']}}))
    return jsonify({"totalEarnings": total_earnings}), 200



@app.route('/testExpireWager', methods=['POST'])
def test_expire_wager():
    """
    Simulate the expiration of a wager (for testing purposes).

    - Validate the provided wager ID.
    - Mock grades for participants to simulate the process of determining a winner.
    - Calculate total winnings, update the winner's balance, and move the wager to participants' past wagers.

    Request JSON:
    {
        "wagerId": "wager_id"
    }

    Response:
    - Success: 200 with winner details and total winnings.
    - Error: 400 for invalid input or no active participants, 404 for missing or expired wager.
    """
    data = request.json
    wager_id = data.get('wagerId')

    try:
        wager_id = ObjectId(wager_id)
    except:
        return jsonify({"error": "Invalid wagerId format"}), 400

    wager = wagers_collection.find_one({"_id": wager_id, "active": True})
    if not wager:
        return jsonify({"error": "Wager not found or already expired"}), 404

    participants = wager['activeParticipants']
    if not participants:
        return jsonify({"error": "No active participants in the wager"}), 400

    grades = []
    for participant_id in participants:
        user = users_collection.find_one({"_id": participant_id})
        if user:
            grades.append({
                "user_id": participant_id,
                "email": user["email"],
                "grade": 100,  # Mock grade 
                "name": user["name"]
            })

    winner = max(grades, key=lambda x: x['grade'])
    winner_id = winner['user_id']
    winner_name = winner['name']
    winner_email = winner['email']

    entry_amount = wager.get('entryAmount', 0)
    prize = wager.get('prize', 0)
    total_winnings = len(participants) * entry_amount + prize


    users_collection.update_one(
        {"_id": winner_id},
        {
            "$inc": {"balance": total_winnings},
            "$push": {"pastWagers": wager_id}
        }
    )

    wagers_collection.update_one(
        {"_id": wager_id},
        {"$set": {"active": False, "winner": winner_name}}
    )

    users_collection.update_many(
        {"_id": {"$in": participants}},
        {
            "$push": {"pastWagers": wager_id},
            "$pull": {"activeWagers": wager_id}
        }
    )

    return jsonify({
        "message": "Test wager expiration executed successfully",
        "winner": winner_name,
        "winnerEmail": winner_email,
        "totalWinnings": total_winnings
    }), 200



@app.route('/getActiveWagers', methods=['GET'])
def get_active_wagers():
    """
    Retrieve all active wagers for a specific user.

    - Validate the provided email.
    - Fetch the user's active wagers from the database.
    - Return the wager details, including creator email, participants, and wager info.

    Request Parameters:
    - email: User's email.

    Response:
    - Success: 200 with a list of active wagers.
    - Error: 400 for invalid input, 404 for missing user, or 500 for server error.
    """
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404

        active_wager_ids = user.get('activeWagers', [])
        active_wagers = list(wagers_collection.find({"_id": {"$in": active_wager_ids}, "active": True}))

        active_wagers_response = []
        for wager in active_wagers:
            active_wagers_response.append({
                "wagerId": str(wager["_id"]),
                "creatorEmail": wager.get("creatorEmail", ""),
                "class": wager.get("class", ""),
                "assignment": wager.get("assignment", ""),
                "courseId": wager.get("courseId", ""),
                "assignmentId": wager.get("assignmentId", ""),
                "semester": wager.get("semester", ""),
                "entryAmount": wager.get("entryAmount", 0),
                "prize": wager.get("prize", 0),
                "imageId": wager.get("imageId", ""),
                "activeParticipants": wager.get("activeParticipants", []),
                "pendingParticipants": wager.get("pendingParticipants", []),
                "endTime": wager.get("endTime", ""),
                "active": wager.get("active", True),
                "winner": wager.get("winner", "")
            })

        return jsonify({"activeWagers": active_wagers_response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/getPendingInvitations', methods=['GET'])
def get_pending_invitations():
    """
    Retrieve all pending wager invitations for a specific user.

    - Validate the provided email.
    - Fetch the user's pending invitations from the database.
    - Return the wager details for all pending invitations.

    Request Parameters:
    - email: User's email.

    Response:
    - Success: 200 with a list of pending wagers.
    - Error: 400 for invalid input, 404 for missing user, or 500 for server error.
    """
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404

        pending_wager_ids = user.get('pendingInvitations', [])
        pending_wagers = list(wagers_collection.find({"_id": {"$in": pending_wager_ids}, "active": True}))

        pending_wagers_response = []
        for wager in pending_wagers:
            pending_wagers_response.append({
                "wagerId": str(wager["_id"]),
                "creatorEmail": wager.get("creatorEmail", ""),
                "class": wager.get("class", ""),
                "assignment": wager.get("assignment", ""),
                "courseId": wager.get("courseId", ""),
                "assignmentId": wager.get("assignmentId", ""),
                "semester": wager.get("semester", ""),
                "entryAmount": wager.get("entryAmount", 0),
                "prize": wager.get("prize", 0),
                "imageId": wager.get("imageId", ""),
                "endTime": wager.get("endTime", ""),
                "active": wager.get("active", True),
            })

        return jsonify({"pendingInvitations": pending_wagers_response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/getCourses', methods=['POST'])
def get_courses():
    """
    Retrieve the list of courses available to a user.

    - Validate the provided email.
    - Fetch courses for the user from Gradescope.

    Request Parameters:
    - email: User's email.

    Response:
    - Success: 200 with a list of courses and their IDs.
    - Error: 400 for invalid input, 404 for missing user, or 500 for server error.
    """
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404

        decrypted_password = decrypt_password(user['password'])
        connection = gradescope_login(email, decrypted_password)
        courses = connection.account.get_courses()

        course_data = []
        for role, role_courses in courses.items():
            for course_id, course in role_courses.items():
                course_data.append({
                    "courseId": course_id,
                    "courseName": course.name
                })

        return jsonify({"courses": course_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/getAssignments', methods=['GET'])
def get_assignments():
    """
    Retrieve the list of assignments for a specific course.

    - Validate the provided course ID and email.
    - Fetch assignments for the specified course.

    Request Parameters:
    - email: User's email.
    - courseId: The ID of the course for which assignments are fetched.

    Response:
    - Success: 200 with a list of assignment names and IDs.
    - Error: 400 for invalid input, 404 for missing user or course, or 500 for server error.
    """
    email = request.args.get('email')
    course_id = request.args.get('courseId')

    if not email or not course_id:
        return jsonify({"error": "Email and courseId are required"}), 400

    try:
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404

        decrypted_password = decrypt_password(user['password'])
        connection = gradescope_login(email, decrypted_password)
        assignments = connection.account.get_assignments(int(course_id))

        assignment_data = []
        for assignment in assignments:
            assignment_data.append({
                "assignmentId": assignment.assignment_id,
                "assignmentName": assignment.name,
                "grade": assignment.grade,
                "maxGrade": assignment.max_grade,
                "status": assignment.submissions_status
            })

        return jsonify({"assignments": assignment_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500





if __name__ == "__main__":
    app.run(debug=True)
