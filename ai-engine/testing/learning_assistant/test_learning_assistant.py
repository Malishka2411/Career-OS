import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "ai-engine"))

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def _seed_learner_with_skills(learner_id: str):
    client.post(f"/digital-twin/{learner_id}", params={"full_name": "Learning Test Learner"})
    client.post(
        "/career-intelligence/",
        json={
            "learner_id": learner_id,
            "quiz_responses": [
                {"skill": "Python", "correct": False, "difficulty": 2},
                {"skill": "SQL", "correct": True, "difficulty": 1},
            ],
            "career_interests": [],
        },
    )


def test_weekly_plan_prioritizes_weakest_skill():
    _seed_learner_with_skills("la_test_001")
    response = client.post("/learning-assistant/", json={"learner_id": "la_test_001", "weeks_available": 2})
    assert response.status_code == 200
    body = response.json()
    assert len(body["weekly_plan"]) == 2
    assert body["next_recommended_topic"] == "Python"  # weaker of the two seeded skills


def test_no_skills_returns_empty_plan():
    client.post("/digital-twin/la_test_002", params={"full_name": "No Skills Learner"})
    response = client.post("/learning-assistant/", json={"learner_id": "la_test_002"})
    assert response.status_code == 200
    body = response.json()
    assert body["weekly_plan"] == []
    assert body["next_recommended_topic"] is None
