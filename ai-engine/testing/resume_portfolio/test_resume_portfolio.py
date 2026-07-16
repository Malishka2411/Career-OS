import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "ai-engine"))

from fastapi.testclient import TestClient

import resume_portfolio.service as resume_service
from main import app

client = TestClient(app)


def _fake_generate_text(system_prompt, user_prompt, max_tokens=600, temperature=0.7):
    return json.dumps(
        {
            "resume_summary": "Aspiring engineer skilled in Python with hands-on project experience.",
            "linkedin_summary": "Early-career engineer passionate about building useful software.",
        }
    )


def test_resume_generation_with_mocked_llm(monkeypatch):
    monkeypatch.setattr(resume_service, "generate_text", _fake_generate_text)

    client.post("/digital-twin/rp_test_001", params={"full_name": "Resume Test Learner"})
    client.post(
        "/career-intelligence/",
        json={
            "learner_id": "rp_test_001",
            "quiz_responses": [{"skill": "Python", "correct": True, "difficulty": 1}],
            "career_interests": [],
        },
    )

    response = client.post("/resume-portfolio/", json={"learner_id": "rp_test_001", "tone": "professional"})
    assert response.status_code == 200
    body = response.json()
    assert "Python" in body["resume_summary"]
    assert body["ats_score"] > 0


def test_resume_generation_fails_gracefully_without_llm():
    # No monkeypatch here — real generate_text will raise LLMGenerationError
    # because ANTHROPIC_API_KEY is unset in the test environment.
    client.post("/digital-twin/rp_test_002", params={"full_name": "No Key Learner"})
    response = client.post("/resume-portfolio/", json={"learner_id": "rp_test_002"})
    assert response.status_code == 502
    assert response.json()["error_code"] == "llm_generation_failed"
