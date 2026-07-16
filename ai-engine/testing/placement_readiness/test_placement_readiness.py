import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "ai-engine"))

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_readiness_score_reflects_seeded_signals():
    client.post("/digital-twin/pr_test_001", params={"full_name": "Readiness Test Learner"})

    # Seed some coding history via Technical Assessment.
    client.post(
        "/technical-assessment/",
        json={
            "learner_id": "pr_test_001",
            "problem_id": "sum-two",
            "language": "python",
            "code": "a, b = map(int, input().split())\nprint(a + b)\n",
            "test_cases": [{"stdin": "2 3", "expected_output": "5"}],
        },
    )

    response = client.post("/placement-readiness/", json={"learner_id": "pr_test_001"})
    assert response.status_code == 200
    body = response.json()
    assert 0 <= body["overall_score"] <= 100
    assert body["breakdown"]["coding"] == 100.0
    # No projects/certifications/interviews seeded, so suggestions should mention them.
    assert any("project" in s.lower() for s in body["improvement_suggestions"])


def test_readiness_is_saved_into_digital_twin():
    twin = client.get("/digital-twin/pr_test_001").json()
    assert twin["placement_readiness"] is not None
    assert twin["placement_readiness"]["overall_score"] > 0
