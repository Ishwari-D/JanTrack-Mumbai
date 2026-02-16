import json
from pymongo import MongoClient, UpdateOne

# Replace with your actual connection string

import os
from dotenv import load_dotenv

load_dotenv()
CONNECTION_STRING = os.getenv("MONGODB_URI")

COLLECTION = MongoClient(CONNECTION_STRING)["civic-connect"]["candidates"]

def sync_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    operations = []
    for item in data:
        # The 'Upsert' magic: search by 'id', update the rest
        operations.append(UpdateOne(
            {"id": item["id"]}, 
            {"$set": item}, 
            upsert=True
        ))
    
    if operations:
        result = COLLECTION.bulk_write(operations)
        print(f"📊 Sync Complete: {result.upserted_count} new, {result.modified_count} updated.")

if __name__ == "__main__":
    sync_data('data_stream.json')