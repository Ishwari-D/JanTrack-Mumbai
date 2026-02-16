import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
CONNECTION_STRING = os.getenv("MONGODB_URI")

if not CONNECTION_STRING:
    print("Error: MONGODB_URI not found in environment variables.")
    exit(1)

COLLECTION = MongoClient(CONNECTION_STRING)["civic-connect"]["candidates"]

def delete_by_id_range():
    print("Fetching all candidates to filter by ID...")
    all_candidates = list(COLLECTION.find({}, {"id": 1}))
    
    ids_to_delete = []
    
    for candidate in all_candidates:
        try:
            # Convert ID to int for comparison
            # IDs are stored as strings in JSON: "48"
            candidate_id = int(candidate.get("id", "0"))
            
            # Check range
            if candidate_id >= 48:
                ids_to_delete.append(candidate["id"])
        except ValueError:
            # Skip candidates with non-numeric IDs if any
            continue
    
    if not ids_to_delete:
        print("No candidates found with ID >= 48.")
        return

    print(f"Found {len(ids_to_delete)} candidates with ID >= 48.")
    confirm = input("Type 'yes' to proceed with deletion: ")
    
    if confirm.lower() == 'yes':
        result = COLLECTION.delete_many({"id": {"$in": ids_to_delete}})
        print(f"Deleted {result.deleted_count} candidates.")
    else:
        print("Deletion cancelled.")

if __name__ == "__main__":
    delete_by_id_range()
