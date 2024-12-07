
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://mohammedamin:7H3B9wYuT095F5jD@betsmart.l7eyf.mongodb.net/?retryWrites=true&w=majority&appName=BetSmart"

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


    