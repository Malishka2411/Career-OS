import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "ai-engine"))

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_correct_code_passes_all_tests():
    client.post("/digital-twin/ta_test_001", params={"full_name": "Coding Test Learner"})

    payload = {
        "learner_id": "ta_test_001",
        "problem_id": "double-number",
        "language": "python",
        "code": "n = int(input())\nprint(n * 2)\n",
        "test_cases": [
            {"stdin": "5", "expected_output": "10"},
            {"stdin": "3", "expected_output": "6"},
        ],
    }
    response = client.post("/technical-assessment/", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["correctness_score"] == 100.0
    assert body["passed_test_cases"] == 2


def test_wrong_code_reports_partial_failure():
    client.post("/digital-twin/ta_test_002", params={"full_name": "Buggy Coder"})

    payload = {
        "learner_id": "ta_test_002",
        "problem_id": "double-number",
        "language": "python",
        "code": "n = int(input())\nprint(n + 1)\n",  # wrong logic on purpose
        "test_cases": [
            {"stdin": "5", "expected_output": "10"},
            {"stdin": "3", "expected_output": "6"},
        ],
    }
    response = client.post("/technical-assessment/", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["correctness_score"] == 0.0
    assert body["passed_test_cases"] == 0
    assert "Test case" in body["feedback"] or "failed" in body["feedback"].lower()


def test_infinite_loop_times_out_instead_of_hanging():
    client.post("/digital-twin/ta_test_003", params={"full_name": "Timeout Coder"})

    payload = {
        "learner_id": "ta_test_003",
        "problem_id": "inf-loop",
        "language": "python",
        "code": "while True:\n    pass\n",
        "test_cases": [{"stdin": "", "expected_output": "anything"}],
    }
    response = client.post("/technical-assessment/", json=payload)
    assert response.status_code == 200
    assert response.json()["correctness_score"] == 0.0


def test_submission_is_recorded_in_digital_twin():
    twin = client.get("/digital-twin/ta_test_001").json()
    assert len(twin["coding_history"]) == 1
    assert twin["coding_history"][0]["problem_id"] == "double-number"
