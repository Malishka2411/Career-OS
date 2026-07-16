# AI Engine — API Contracts

Living document of the actual request/response shapes exposed by the
AI Engine, for the Backend team to integrate against. Update this
whenever a sub-system's `models.py` changes.

Base URL (local dev): `http://localhost:8001`
All endpoints below (except `/health`) expect header `X-Service-Token`
matching `AUTH_SHARED_SECRET`.

## Digital Twin — `/digital-twin`

| Method | Path | Description |
|---|---|---|
| GET | `/digital-twin/{learner_id}` | Fetch a learner's full Digital Twin |
| POST | `/digital-twin/{learner_id}?full_name=...` | Create a new empty Digital Twin |
| PUT | `/digital-twin/` | Replace/update a full Digital Twin (body: `DigitalTwin`) |

See `digital_twin/schema.py` for the full `DigitalTwin` shape (skills,
certifications, projects, coding history, interview history, resume,
placement readiness).

## Career Intelligence — `/career-intelligence`

`POST /career-intelligence/`

Request:
```json
{
  "learner_id": "stu_001",
  "quiz_responses": [
    { "skill": "Python", "correct": true, "difficulty": 2 }
  ],
  "career_interests": ["Machine Learning"]
}
```

Response:
```json
{
  "learner_id": "stu_001",
  "assessed_skills": { "Python": "intermediate" },
  "roadmap": [
    { "order": 1, "focus_skill": "Python", "reason": "Weakest assessed area..." }
  ],
  "career_interests_confirmed": ["Machine Learning"]
}
```

Creates the learner's Digital Twin if it doesn't exist yet, and writes
assessed skills + confirmed interests into it.

## Learning Assistant — `/learning-assistant`

`POST /learning-assistant/`

Request: `{ "learner_id": "stu_001", "weeks_available": 4 }`

Response: `weekly_plan` (list of `{ week, focus_skill, current_level, goal }`)
plus `next_recommended_topic`. Reads skill mastery from the Digital Twin —
returns an empty plan if no skills have been assessed yet.

## Resume & Portfolio — `/resume-portfolio`

`POST /resume-portfolio/`

Request: `{ "learner_id": "stu_001", "tone": "professional" }`

Response: `{ "resume_summary": "...", "linkedin_summary": "...", "ats_score": 82.5 }`

Requires `ANTHROPIC_API_KEY` to be set — returns `502 llm_generation_failed`
if unset or the API call fails. Writes `ats_score` back into the twin's resume field.

## Project Lab — `/project-lab`

`POST /project-lab/`

Request: `{ "learner_id": "stu_001", "focus_area": "Machine Learning" }`
(`focus_area` optional — defaults to the learner's top career interest)

Response: `project_spec` = `{ title, problem_statement, tech_stack, dataset_suggestions, architecture_overview }`

Appends the generated project to the twin's `projects` list with `generated_by_ai: true`.

## Technical Assessment — `/technical-assessment`

`POST /technical-assessment/`

Request:
```json
{
  "learner_id": "stu_001",
  "problem_id": "double-number",
  "language": "python",
  "code": "n = int(input())\nprint(n * 2)",
  "test_cases": [{ "stdin": "5", "expected_output": "10" }]
}
```

Response: `{ correctness_score, efficiency_score, code_quality_score, passed_test_cases, total_test_cases, feedback }`

Only `language: "python"` is executed in this reference implementation.
Code runs in a subprocess with a 5s timeout — **not yet a real security
sandbox**, see the warning at the top of `technical_assessment/service.py`
before pointing this at untrusted production traffic. Appends a
`CodingSubmission` to the twin's `coding_history`.

## HR Simulator — `/hr-simulator`

`POST /hr-simulator/`

Stateful, multi-turn. First call (no `session_id`) starts a session and
returns the opening question. Subsequent calls pass `session_id` +
`candidate_message`. After 4 exchanges, the response includes
`is_complete: true` and an `evaluation` block, and the result is saved
to the twin's `interview_history`.

Request (start): `{ "learner_id": "stu_001" }`
Request (continue): `{ "learner_id": "stu_001", "session_id": "...", "candidate_message": "..." }`
Response: `{ session_id, agent_message, is_complete, evaluation }` (evaluation only present when `is_complete: true`)

## Placement Readiness — `/placement-readiness`

`POST /placement-readiness/`

Request: `{ "learner_id": "stu_001" }`

Response: `{ overall_score, breakdown: { coding, technical_knowledge, communication, resume_quality, projects, certifications }, improvement_suggestions }`

Pure weighted aggregation of signals already in the Digital Twin — no
LLM call. Saves the result into the twin's `placement_readiness` field.

## Recruiter Agent — `/recruiter-agent`

`POST /recruiter-agent/`

Request: `{ "query": "Find AI engineers with strong Python skills", "top_k": 5 }`

Response: `{ interpreted_skills: ["Python"], candidates: [{ learner_id, full_name, match_score, matched_skills, explanation }] }`

Searches across every Digital Twin currently in the store, ranked by
skill overlap (60%) + placement readiness score (40%).

---

**Convention:** each sub-team updates their section above in the same
PR that changes their `models.py`, so this file never goes stale.
