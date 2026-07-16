import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "ai-engine"))

from fastapi.testclient import TestClient

import hr_simulator.service as hr_service
from main import app

client = TestClient(app)


def _fake_generate_text(system_prompt, user_prompt, max_tokens=150, temperature=0.7):
    if "evaluator" in system_prompt.lower():
        return json.dumps(
            {
                "communication_score": 82,
                "confidence_score": 75,
                "professionalism_score": 90,
                "feedback_summary": "Clear, well-structured answers throughout the interview.",
            }
        )
    return "Tell me about a time you handled a conflict with a teammate."


def test_full_interview_flow_reaches_completion(monkeypatch):
    monkeypatch.setattr(hr_service, "generate_text", _fake_generate_text)

    client.post("/digital-twin/hr_test_001", params={"full_name": "Interview Test Learner"})

    # Turn 1: start session
    r1 = client.post("/hr-simulator/", json={"learner_id": "hr_test_001"})
    assert r1.status_code == 200
    body1 = r1.json()
    session_id = body1["session_id"]
    assert body1["is_complete"] is False
    assert body1["agent_message"]

    # Turns 2-4: continue answering
    for _ in range(3):
        r = client.post(
            "/hr-simulator/",
            json={"learner_id": "hr_test_001", "session_id": session_id, "candidate_message": "My answer."},
        )
        assert r.status_code == 200
        assert r.json()["is_complete"] is False

    # Turn 5: final answer -> should trigger evaluation
    r_final = client.post(
        "/hr-simulator/",
        json={"learner_id": "hr_test_001", "session_id": session_id, "candidate_message": "Final answer."},
    )
    assert r_final.status_code == 200
    final_body = r_final.json()
    assert final_body["is_complete"] is True
    assert final_body["evaluation"]["communication_score"] == 82

    # Digital Twin should now have the HR interview result recorded.
    twin = client.get("/digital-twin/hr_test_001").json()
    assert len(twin["interview_history"]) == 1
    assert twin["interview_history"][0]["interview_type"] == "hr"
