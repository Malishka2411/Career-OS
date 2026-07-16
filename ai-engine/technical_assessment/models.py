"""
Request/response models specific to the TechnicalAssessment sub-system.
Keep these separate from digital_twin/schema.py -- that file is the
shared learner profile; these are this endpoint's own I/O shapes.
"""

from pydantic import BaseModel


class TestCase(BaseModel):
    stdin: str = ""
    expected_output: str


class TechnicalAssessmentRequest(BaseModel):
    learner_id: str
    problem_id: str
    language: str = "python"  # only "python" is executed in this reference implementation
    code: str
    test_cases: list[TestCase]


class TechnicalAssessmentResponse(BaseModel):
    learner_id: str
    problem_id: str
    correctness_score: float
    efficiency_score: float
    code_quality_score: float
    passed_test_cases: int
    total_test_cases: int
    feedback: str
