import urllib.request
import urllib.parse
import json
import urllib.error

url_base = "https://metalled-pityingly-rochel.ngrok-free.dev/chat"
headers_json = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    "User-Agent": "Mozilla/5.0"
}

def test_request(name, url, data=None, headers=None, method='POST'):
    print(f"\n--- Testing {name} ---")
    try:
        if isinstance(data, dict) and headers and 'application/json' in headers.get('Content-Type', ''):
             body = json.dumps(data).encode('utf-8')
        elif isinstance(data, dict):
             body = urllib.parse.urlencode(data).encode('utf-8')
        else:
             body = data
             
        req = urllib.request.Request(url, data=body, headers=headers or {}, method=method)
        with urllib.request.urlopen(req) as response:
            print(f"SUCCESS: {response.getcode()}")
            print(response.read().decode('utf-8'))
            return True
    except urllib.error.HTTPError as e:
        print(f"FAILED: {e.code}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

# 1. JSON with different keys
keys = ["message", "query", "text", "prompt", "user_input", "question", "input"]
for k in keys:
    test_request(f"JSON key='{k}'", url_base, {k: "Hello"}, headers_json)

# 2. Query Parameter
url_query = f"{url_base}?query=Hello"
test_request("Query Param 'query'", url_query, data=None, headers=headers_json) # Empty body, but POST

# 3. Form Data
headers_form = {
    "Content-Type": "application/x-www-form-urlencoded",
    "ngrok-skip-browser-warning": "true",
    "User-Agent": "Mozilla/5.0"
}
test_request("Form Data 'query'", url_base, {"query": "Hello"}, headers_form)
