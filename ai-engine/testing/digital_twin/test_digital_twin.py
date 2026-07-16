"""
Example test for the Digital Twin sub-system — copy this pattern for
your own sub-system's tests in testing/<your_subteam>/.
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "ai-engine"))

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_root_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_digital_twin_health():
    response = client.get("/digital-twin/health")
    assert response.status_code == 200


def test_create_and_read_twin():
    create_resp = client.post("/digital-twin/stu_test_001", params={"full_name": "Test Student"})
    assert create_resp.status_code == 200
    assert create_resp.json()["learner_id"] == "stu_test_001"

    read_resp = client.get("/digital-twin/stu_test_001")
    assert read_resp.status_code == 200
    assert read_resp.json()["full_name"] == "Test Student"


def test_read_nonexistent_twin_returns_404():
    response = client.get("/digital-twin/does_not_exist")
    assert response.status_code == 404
