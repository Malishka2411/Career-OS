import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "ai-engine"))

from fastapi.testclient import TestClient

import project_lab.service as project_service
from main import app

client = TestClient(app)


def _fake_generate_text(system_prompt, user_prompt, max_tokens=700, temperature=0.7):
    return json.dumps(
        {
            "title": "Personal Finance Tracker",
            "problem_statement": "Build a web app to track personal expenses and visualize spending trends.",
            "tech_stack": ["Python", "FastAPI", "React"],
            "dataset_suggestions": ["Synthetic transaction data", "Public spending category datasets"],
            "architecture_overview": "React frontend, FastAPI backend, SQLite storage.",
        }
    )


def test_project_generation_with_mocked_llm(monkeypatch):
    monkeypatch.setattr(project_service, "generate_text", _fake_generate_text)

    client.post("/digital-twin/pl_test_001", params={"full_name": "Project Test Learner"})

    response = client.post("/project-lab/", json={"learner_id": "pl_test_001", "focus_area": "Web Development"})
    assert response.status_code == 200
    body = response.json()
    assert body["project_spec"]["title"] == "Personal Finance Tracker"
    assert "FastAPI" in body["project_spec"]["tech_stack"]


def test_generated_project_is_appended_to_digital_twin(monkeypatch):
    monkeypatch.setattr(project_service, "generate_text", _fake_generate_text)

    client.post("/digital-twin/pl_test_002", params={"full_name": "Second Test Learner"})
    client.post("/project-lab/", json={"learner_id": "pl_test_002"})

    twin = client.get("/digital-twin/pl_test_002").json()
    assert len(twin["projects"]) == 1
    assert twin["projects"][0]["generated_by_ai"] is True
