from flask import Flask
app = Flask(__name__)

@app.route('/poop/<name>', methods = ['GET'])
def hello(name):
    return f'hi {name}'

@app.route("/get_users")
def user_json():
    return {
        "username": "dhoppers",
        "password": "pass"
    }

if __name__ == "__main__":
    app.run()