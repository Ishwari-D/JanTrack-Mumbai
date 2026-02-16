import os
import re
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
CONNECTION_STRING = os.getenv("MONGODB_URI")

if not CONNECTION_STRING:
    print("Error: MONGODB_URI not found in environment variables.")
    exit(1)

COLLECTION = MongoClient(CONNECTION_STRING)["civic-connect"]["candidates"]

def delete_wards():
    print("Fetching all candidates...")
    all_candidates = list(COLLECTION.find({}, {"id": 1, "ward": 1}))
    
    ids_to_delete = []
    
    for candidate in all_candidates:
        ward_str = candidate.get("ward", "")
        # Extract number from "Ward 18"
        match = re.search(r'\d+', ward_str)
        if match:
            ward_num = int(match.group())
            if 16 <= ward_num <= 227:
                ids_to_delete.append(candidate["id"])
    
    if not ids_to_delete:
        print("No candidates found in Ward range 16-227.")
        return

    print(f"Found {len(ids_to_delete)} candidates to delete from Wards 16-227.")
    confirm = input("Type 'yes' to proceed with deletion: ")
    
    if confirm.lower() == 'yes':
        result = COLLECTION.delete_many({"id": {"$in": ids_to_delete}})
        print(f"Deleted {result.deleted_count} candidates.")
    else:
        print("Deletion cancelled.")

if __name__ == "__main__":
    delete_wards()
