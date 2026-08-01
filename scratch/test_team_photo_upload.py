import requests
import io

BASE_URL = "http://127.0.0.1:8000"

def run_photo_upload_test():
    print("--- 1. Logging in as Admin ---")
    res = requests.post(f"{BASE_URL}/api/auth/login", data={"username": "admin", "password": "Admin@1234"})
    assert res.status_code == 200
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    print("--- 2. Uploading Manual Team Photo File ---")
    dummy_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x03\x00\x05\xfe\x02\xfe\xa7\x9a\x9a\xe2\x00\x00\x00\x00IEND\xaeB`\x82'
    files = {"file": ("team_photo.png", dummy_png, "image/png")}
    r_upload = requests.post(f"{BASE_URL}/api/team/upload-photo", files=files, headers=headers)
    print("Photo Upload Response:", r_upload.status_code, r_upload.json())
    assert r_upload.status_code == 200
    image_url = r_upload.json().get("url")
    assert image_url.startswith("/uploads/team/")

    print("--- 3. Creating Team Member with Uploaded Photo URL ---")
    member_data = {
        "name": "Test Doctor Upload",
        "role": "Medical Specialist",
        "image": image_url,
        "facebook": "https://facebook.com/test",
        "twitter": "",
        "linkedin": "",
        "order": 999
    }
    r_create = requests.post(f"{BASE_URL}/api/team", json=member_data, headers=headers)
    print("Create Member Response:", r_create.status_code, r_create.json())
    assert r_create.status_code == 201
    created_id = r_create.json()["id"]

    print("--- 4. Cleaning Up Test Team Member ---")
    r_delete = requests.delete(f"{BASE_URL}/api/team/{created_id}", headers=headers)
    assert r_delete.status_code == 200

    print("SUCCESS: Manual team member photo file upload verified end-to-end!")

if __name__ == "__main__":
    run_photo_upload_test()
