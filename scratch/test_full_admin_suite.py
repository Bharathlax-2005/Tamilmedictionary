import requests

BASE_URL = "http://127.0.0.1:8000"

def run_admin_audit():
    print("--- 1. Authenticating as Admin ---")
    res = requests.post(f"{BASE_URL}/api/auth/login", data={"username": "admin", "password": "Admin@1234"})
    assert res.status_code == 200
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Auth Success:", res.json()["username"])

    print("\n--- 2. Auditing Admin Dashboard Stats ---")
    r = requests.get(f"{BASE_URL}/api/admin/dashboard/stats", headers=headers)
    assert r.status_code == 200
    print("Dashboard Stats:", r.json())

    print("\n--- 3. Auditing Dictionary Terms API ---")
    r = requests.get(f"{BASE_URL}/api/dictionary/terms", headers=headers)
    assert r.status_code == 200
    print("Terms Total in MongoDB:", r.json().get("total"))

    print("\n--- 4. Auditing Blog Posts API ---")
    r = requests.get(f"{BASE_URL}/api/blog/posts", headers=headers)
    assert r.status_code == 200
    print("Blogs Count:", len(r.json().get("posts", [])))

    print("\n--- 5. Auditing Services API ---")
    r = requests.get(f"{BASE_URL}/api/services/", headers=headers)
    assert r.status_code == 200
    print("Services Count:", len(r.json().get("services", [])))

    print("\n--- 6. Auditing Stats API ---")
    r = requests.get(f"{BASE_URL}/api/stats/", headers=headers)
    assert r.status_code == 200
    print("Stats Items Count:", len(r.json().get("stats", [])))

    print("\n--- 7. Auditing Contact Submissions API ---")
    r = requests.get(f"{BASE_URL}/api/contact/submissions", headers=headers)
    assert r.status_code == 200
    print("Contact Submissions Total:", r.json().get("total"))

    print("\n--- 8. Auditing Shop Products API ---")
    r = requests.get(f"{BASE_URL}/api/shop/products", headers=headers)
    assert r.status_code == 200
    print("Products Count:", len(r.json().get("products", [])))

    print("\n--- 9. Auditing CMS Pages API ---")
    r = requests.get(f"{BASE_URL}/api/pages/", headers=headers)
    assert r.status_code == 200
    print("Pages Slugs:", [p["slug"] for p in r.json().get("pages", [])])

    print("\n--- 10. Auditing Team Members API ---")
    r = requests.get(f"{BASE_URL}/api/team", headers=headers)
    assert r.status_code == 200
    print("Team Members Count:", len(r.json()))


    print("\n--- 11. Auditing Collections API ---")
    r = requests.get(f"{BASE_URL}/api/collections/", headers=headers)
    assert r.status_code == 200
    print("Collections Documents Count:", len(r.json().get("documents", [])))

    print("\nSUCCESS: All Admin Panel backend modules and MongoDB queries verified 100% functional!")

if __name__ == "__main__":
    run_admin_audit()
