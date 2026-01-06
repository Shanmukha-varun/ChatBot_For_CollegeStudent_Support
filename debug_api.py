import urllib.request
import json
import urllib.error

url = "https://metalled-pityingly-rochel.ngrok-free.dev/chat"
data = {
    "query": "Hello"
}
headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    "User-Agent": "Mozilla/5.0"
}

try:
    print(f"Sending POST to {url} with data: {data}")
    json_data = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=json_data, headers=headers, method='POST')
    
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print("Response Body:")
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print("Error Body:")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
