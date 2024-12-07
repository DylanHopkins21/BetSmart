from flask import Flask
app = Flask(__name__)

#login
@app.route('/gradescopeAuth')

@app.route('/getActiveWagers')
def getActiveWagers():
    return {"name" : "audrey"}

@app.route('/getNotifs')

@app.route('/expireWager')
#move when some negative time 

@app.route('/getPastWagers')

@app.route('/getTotalEarnings')
#summation of all entries in past wagers 


@app.route('/acceptInvite')

@app.route('/rejectInvite')

@app.route('/createWager')
#move created to add to active wagers 

if __name__ == "__main__":
    app.run()