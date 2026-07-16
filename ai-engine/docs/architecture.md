# AI Engine — Architecture

## Overview

The AI Engine is a single FastAPI service (`main.py`) that mounts one
router per sub-system. The **Digital Twin** is the architectural hub:
every other sub-system reads from and/or writes to it.

```
                        ┌─────────────────────┐
                        │   Backend Service    │
                        │  (owns users, auth,   │
                        │   primary DB, APIs)   │
                        └──────────┬───────────┘
                                   │ REST (X-Service-Token)
                                   ▼
                        ┌─────────────────────┐
                        │      AI Engine        │
                        │      (main.py)        │
                        └──────────┬───────────┘
           ┌───────────┬───────────┼───────────┬───────────┐
           ▼           ▼           ▼           ▼           ▼
    Career Intel   Learning    Resume/     Technical    HR
     ligence       Assistant   Portfolio   Assessment   Simulator
           │           │           │           │           │
           └───────────┴─────┬─────┴───────────┴───────────┘
                              ▼
                       ┌─────────────┐
                       │ Digital Twin │  ← shared learner profile
                       └──────┬──────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
        Placement Readiness          Recruiter Agent
        (aggregates signals)      (queries twins for search)
```

## Request Flow (typical)

1. Student performs an activity (learning, coding, interview) in the
   Frontend.
2. Frontend → Backend → relevant AI Engine sub-system endpoint.
3. Sub-system processes the activity and calls `digital_twin.service`
   to read/update the learner's profile.
4. Sub-system returns its result → Backend → Frontend.
5. Downstream sub-systems (e.g. Placement Readiness) read the updated
   Digital Twin next time they run.

## Why a monolith-of-routers instead of separate microservices per sub-team

At the current stage, one FastAPI app with per-folder routers gives:

- One process to run locally (`uvicorn main:app`) instead of 9.
- Shared `shared/` utilities (auth, logging, LLM client, DB) without
  duplicating them per service.
- Simple horizontal scaling later: if one sub-system becomes a
  bottleneck (e.g. Technical Assessment sandboxing), it can be split
  out into its own deployable service without changing its internal
  code — only how `main.py` mounts it.

## Folder-to-architecture mapping

See `README.md` for the folder ownership table. Each folder's
`router.py` corresponds to one box in the diagram above.

## Auth model

Every non-health endpoint depends on `shared.auth.verify_backend_request`,
which checks an `X-Service-Token` header against `AUTH_SHARED_SECRET`.
This assumes Backend is the only caller of the AI Engine — Frontend
never calls it directly. Update this doc if that assumption changes.
