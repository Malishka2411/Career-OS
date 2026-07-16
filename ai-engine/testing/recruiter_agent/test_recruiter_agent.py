import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "ai-engine"))

from fastapi.testclient import TestClient

import recruiter_agent.service as recruiter_service
from main import app

client = TestClient(app)


def _fake_generate_text(system_prompt, user_prompt, max_tokens=200, temperature=0.7):
    return json.dumps({"required_skills": ["Python"]})


def _seed_candidate(learner_id: str, skill: str, correct: bool):
    client.post(f"/digital-twin/{learner_id}", params={"full_name": f"Candidate {learner_id}"})
    client.post(
        "/career-intelligence/",
        json={
            "learner_id": learner_id,
            "quiz_responses": [{"skill": skill, "correct": correct, "difficulty": 2}],
            "career_interests": [],
        },
    )


def test_recruiter_search_ranks_matching_candidate_higher(monkeypatch):
    monkeypatch.setattr(recruiter_service, "generate_text", _fake_generate_text)

    _seed_candidate("ra_test_python", "Python", correct=True)
    _seed_candidate("ra_test_java", "Java", correct=True)

    response = client.post(
        "/recruiter-agent/", json={"query": "Find engineers with strong Python skills", "top_k": 50}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["interpreted_skills"] == ["Python"]

    candidate_ids = [c["learner_id"] for c in body["candidates"]]
    python_index = candidate_ids.index("ra_test_python")
    java_index = candidate_ids.index("ra_test_java")
    assert python_index < java_index  # Python candidate should rank higher
