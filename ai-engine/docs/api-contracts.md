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

| Method | Path | Request Body | Response |
|---|---|---|---|
| POST | `/career-intelligence/` | `{ "learner_id": str }` | `{ "learner_id": str, ... }` |

*Status: stub — sub-team to fill in real request/response fields as
the initial assessment logic is built.*

## Learning Assistant — `/learning-assistant`

*Status: stub.* Expected to accept `learner_id` and return a generated
roadmap/weekly goals once implemented.

## Resume & Portfolio — `/resume-portfolio`

*Status: stub.* Expected to accept `learner_id` and return generated
resume/portfolio content + an ATS score.

## Project Lab — `/project-lab`

*Status: stub.* Expected to accept `learner_id` + interests and return
a generated project spec (problem statement, stack, architecture).

## Technical Assessment — `/technical-assessment`

*Status: stub.* Expected to accept submitted code + problem ID and
return correctness/efficiency/quality scores plus feedback.

## HR Simulator — `/hr-simulator`

*Status: stub.* Expected to manage a multi-turn interview session and
return structured behavioral feedback at the end.

## Placement Readiness — `/placement-readiness`

*Status: stub.* Expected to accept `learner_id`, pull signals from the
Digital Twin, and return an aggregated readiness score + breakdown.

## Recruiter Agent — `/recruiter-agent`

*Status: stub.* Expected to accept a natural-language recruiter query
and return a ranked list of matching learner IDs with explanations.

---

**Convention:** each sub-team updates their section above in the same
PR that changes their `models.py`, so this file never goes stale.
