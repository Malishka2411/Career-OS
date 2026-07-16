# AI Engine — Onboarding

Welcome to the AI Team. This doc gets you from zero to a running local
copy of `ai-engine/` and your first PR.

## 1. Get the code running

```bash
git clone <repo-url>
cd AI-CareerOS/ai-engine
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in ANTHROPIC_API_KEY at minimum
uvicorn main:app --reload --port 8001
```

Visit `http://localhost:8001/docs` — you should see interactive API
docs (Swagger UI) listing every sub-system's endpoints.

## 2. Run the tests

```bash
pytest testing/ -v
```

All tests should pass out of the box (they run against in-memory
storage, no real DB needed yet).

## 3. Find your sub-team's folder

Check `README.md` in this folder for the ownership table. Each
sub-team owns exactly one top-level folder (`hr_simulator/`,
`technical_assessment/`, etc.) containing:

- `router.py` — FastAPI endpoints (keep thin)
- `service.py` — actual logic goes here
- `models.py` — request/response shapes for this sub-system only
- `__init__.py`

## 4. Your first task

1. Open your sub-team's `models.py` — replace the `# TODO` fields with
   the real request/response shape your feature needs.
2. Implement the logic in `service.py`. Use:
   - `shared.llm_client.generate_text(...)` for anything generative
   - `shared.logging_config.get_logger(__name__)` for logging
   - `shared.exceptions` for raising errors (don't raise bare `Exception`)
3. Update `router.py` if your endpoint shape changed.
4. Write/update a test in `testing/<your_subteam>/` — copy the pattern
   in `testing/digital_twin/test_digital_twin.py`.
5. Update `docs/api-contracts.md` with your final request/response shape.
6. Open a PR on branch `ai/<your_subteam>/<feature-name>`.

## 5. Rules of the road

- Don't edit another sub-team's folder without their review.
- Don't edit `digital_twin/schema.py` without the Digital Twin lead +
  AI lead reviewing — it's a shared contract with Backend.
- Don't commit `.env` — it's git-ignored on purpose.
- Don't write your own Anthropic API wrapper — use `shared/llm_client.py`.

## 6. Who to ask

- AI Lead: _[fill in]_
- Digital Twin sub-team lead: _[fill in]_
- Backend integration contact: _[fill in]_
