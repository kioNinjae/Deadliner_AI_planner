from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class AssignmentCreate(BaseModel):
    title: str
    subject: str
    type: str  # assignment, exam, project
    due_date: str
    priority: str  # low, medium, high
    estimated_hours: float
    description: Optional[str] = None

class Assignment(BaseModel):
    id: str
    title: str
    subject: str
    type: str
    due_date: str
    priority: str
    estimated_hours: float
    description: Optional[str] = None
    completed: bool = False
    created_at: str
    user_id: str

class TaskCreate(BaseModel):
    assignment_id: str
    title: str
    description: str
    scheduled_date: str
    duration: int  # in minutes
    type: str  # study, assignment, reminder
    priority: str

class Task(BaseModel):
    id: str
    assignment_id: str
    title: str
    description: str
    scheduled_date: str
    duration: int
    completed: bool = False
    type: str
    priority: str
    user_id: str

class StudyProfile(BaseModel):
    daily_study_hours: float = 4.0
    preferred_study_times: List[str] = ["morning", "evening"]
    subjects: List[str] = ["Math", "Science", "History", "English"]
    study_style: str = "distributed"  # focused, distributed

class User(BaseModel):
    id: str
    email: str
    name: str
    study_profile: StudyProfile
    created_at: str

class TimerSession(BaseModel):
    id: str
    user_id: str
    task_id: Optional[str] = None
    task_title: str
    start_time: str
    end_time: Optional[str] = None
    duration: int  # in seconds
    points_earned: int
    completed: bool = False

class UserWallet(BaseModel):
    user_id: str
    total_points: int = 0
    total_earnings: float = 0.0
    sessions_completed: int = 0
    total_study_time: int = 0  # in seconds
    rewards_redeemed: List[dict] = []

class RewardRedemption(BaseModel):
    tier_points: int
    amount: float
    redeemed_at: str

class DailyPlan(BaseModel):
    date: str
    tasks: List[Task]
    total_study_time: int
    completed: bool