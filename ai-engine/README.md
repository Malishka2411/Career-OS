# AI Engine — XTRAGRAD AI CareerOS

This folder contains all AI Team code: models, generative pipelines, and
FastAPI services that power the platform's intelligence layer.

## Folder Ownership

| Folder | Sub-team | Owns |
|---|---|---|
| `digital_twin/` | Digital Twin Core | Shared learner profile schema + storage. **Every other module depends on this.** |
| `career_intelligence/` | Career Intelligence | Initial skill/interest assessment, roadmap seed generation |
| `learning_assistant/` | Learning Assistant | Adaptive learning paths, weekly goals, progress tracking |
| `resume_portfolio/` | Resume/Portfolio Studio | Resume, portfolio, LinkedIn summary generation |
| `project_lab/` | Project & Innovation Lab | Project idea + spec generation |
| `technical_assessment/` | Technical Assessment | Code sandboxing, correctness/quality scoring, feedback |
| `hr_simulator/` | HR Recruitment Simulator | Conversational interview agent, behavioral scoring |
| `placement_readiness/` | Placement Readiness | Aggregate readiness score |
| `recruiter_agent/` | Recruiter Agent | Natural-language candidate search + ranking |
| `shared/` | Everyone | Common utilities: DB client, auth helpers, config, logging |

Each sub-team **only edits their own folder** plus `shared/` (with review).
Only the Digital Twin sub-team edits `digital_twin/schema.py` directly —
everyone else requests schema changes via PR + AI lead review, since it's
a shared contract with Backend.

## Running Locally

```bash
cd ai-engine
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

Health check: `GET http://localhost:8001/health`
Each sub-system also exposes its own `GET /<subsystem>/health` once its
router is added to `main.py`.

## Adding a New Sub-System Router

1. Build your logic inside your own sub-folder (e.g. `hr_simulator/`).
2. Expose a FastAPI `APIRouter` from `hr_simulator/router.py`.
3. Mount it in `main.py`:
   ```python
   from hr_simulator.router import router as hr_router
   app.include_router(hr_router, prefix="/hr-simulator", tags=["HR Simulator"])
   ```
4. Add at least one test in `testing/hr_simulator/` before opening a PR.

## Branching & PRs

- Branch naming: `ai/<subteam>/<short-feature-name>`
  e.g. `ai/hr-simulator/interview-flow`, `ai/digital-twin/add-cert-field`
- One PR per feature. Keep PRs scoped to your own folder where possible.
- Any PR touching `digital_twin/schema.py` requires review from the
  Digital Twin sub-team lead **and** the AI lead, since Backend and every
  other sub-system depend on this schema.
- Add/update tests in `testing/<your_subteam>/` alongside your PR.

## Environment Variables

Create a `.env` file locally (never commit it — see `.gitignore`):

```
ANTHROPIC_API_KEY=your_key_here
DATABASE_URL=postgresql://...      # provided by Backend team
ENV=development
```

