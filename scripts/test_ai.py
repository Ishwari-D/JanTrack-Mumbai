import urllib.request
import json

url = "http://localhost:5000/api/chat"
data = json.dumps({"message": "How many candidates are there in total?"}).encode("utf-8")
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.getcode())
        print("Response:", json.loads(response.read().decode("utf-8")))
except Exception as e:
    print("Error:", e)
