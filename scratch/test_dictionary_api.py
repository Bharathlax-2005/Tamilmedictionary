import requests

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    print("Testing GET /api/dictionary/categories...")
    r = requests.get(f"{BASE_URL}/api/dictionary/categories")
    print("Categories status:", r.status_code)
    print("Categories data:", r.json())
    assert r.status_code == 200

    print("\nTesting GET /api/dictionary/terms...")
    r = requests.get(f"{BASE_URL}/api/dictionary/terms?page=1&limit=5")
    print("Terms status:", r.status_code)
    data = r.json()
    print(f"Total terms in MongoDB: {data.get('total')}, Page terms count: {len(data.get('results', []))}")
    assert r.status_code == 200

    print("\nTesting GET /api/dictionary/search with query...")
    r = requests.get(f"{BASE_URL}/api/dictionary/search?q=cardio")
    print("Search status:", r.status_code)
    print("Search results count:", len(r.json().get('results', [])))
    assert r.status_code == 200

    print("\nTesting GET /api/dictionary/search with query and category...")
    r = requests.get(f"{BASE_URL}/api/dictionary/search?q=a&category=Basic+Sciences")
    print("Category search status:", r.status_code)
    print("Category search results count:", len(r.json().get('results', [])))
    assert r.status_code == 200

    print("\nSUCCESS: All Dictionary API endpoints verified successfully!")


if __name__ == "__main__":
    test_api()
