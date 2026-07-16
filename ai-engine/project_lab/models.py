"""
Request/response models specific to the ProjectLab sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoint's own I/O shapes.
"""

from pydantic import BaseModel


class ProjectLabRequest(BaseModel):
    learner_id: str
    focus_area: str | None = None  # e.g. "Machine Learning" — defaults to top career interest


class ProjectSpec(BaseModel):
    title: str
    problem_statement: str
    tech_stack: list[str]
    dataset_suggestions: list[str]
    architecture_overview: str


class ProjectLabResponse(BaseModel):
    learner_id: str
    project_spec: ProjectSpec
