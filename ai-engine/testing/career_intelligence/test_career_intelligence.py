import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "ai-engine"))

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_assessment_creates_twin_and_roadmap():
    payload = {
        "learner_id": "ci_test_001",
        "quiz_responses": [
            {"skill": "Python", "correct": True, "difficulty": 2},
            {"skill": "Python", "correct": False, "difficulty": 3},
            {"skill": "SQL", "correct": True, "difficulty": 1},
        ],
        "career_interests": ["Machine Learning"],
    }
    response = client.post("/career-intelligence/", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["assessed_skills"]["Python"] in ("beginner", "intermediate")
    assert "Machine Learning" in body["career_interests_confirmed"]
    assert len(body["roadmap"]) > 0


def test_twin_now_reflects_assessed_skills():
    response = client.get("/digital-twin/ci_test_001")
    assert response.status_code == 200
    skill_names = [s["name"] for s in response.json()["skills"]]
    assert "Python" in skill_names
    assert "SQL" in skill_names
