from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from typing import List, Optional
import uuid
import bcrypt
import os
from dotenv import load_dotenv

from database import connect_to_mongo, close_mongo_connection, get_database
from models import (
    Assignment, AssignmentCreate, Task, TaskCreate, StudyProfile, 
    User, TimerSession, UserWallet, RewardRedemption, DailyPlan
)
from ai_scheduler import AIScheduler

load_dotenv()

app = FastAPI(title="Deadliner AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Dependency to get database
async def get_db():
    return get_database()

# Mock user authentication (for demo purposes)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # In a real app, you'd validate the JWT token here
    return {"id": "demo_user", "email": "demo@example.com", "name": "Demo User"}

# Routes

@app.get("/")
async def root():
    return {"message": "Deadliner AI API is running!"}

@app.post("/api/assignments", response_model=Assignment)
async def create_assignment(
    assignment_data: AssignmentCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Create a new assignment and generate AI-powered task breakdown"""
    try:
        # Create assignment
        assignment_id = str(uuid.uuid4())
        assignment = Assignment(
            id=assignment_id,
            **assignment_data.dict(),
            completed=False,
            created_at=datetime.now().isoformat(),
            user_id=current_user["id"]
        )
        
        # Save to database
        await db.assignments.insert_one(assignment.dict())
        
        # Get user's study profile
        user_profile = await db.users.find_one({"id": current_user["id"]})
        if not user_profile:
            # Create default profile
            default_profile = StudyProfile()
            user = User(
                id=current_user["id"],
                email=current_user["email"],
                name=current_user["name"],
                study_profile=default_profile,
                created_at=datetime.now().isoformat()
            )
            await db.users.insert_one(user.dict())
            profile = default_profile
        else:
            profile = StudyProfile(**user_profile["study_profile"])
        
        # Generate AI tasks
        ai_tasks = AIScheduler.generate_task_breakdown(assignment, profile)
        
        # Save tasks to database
        for task in ai_tasks:
            await db.tasks.insert_one(task.dict())
        
        return assignment
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating assignment: {str(e)}")

@app.get("/api/assignments", response_model=List[Assignment])
async def get_assignments(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get all assignments for the current user"""
    try:
        assignments = []
        async for assignment in db.assignments.find({"user_id": current_user["id"]}):
            assignment["_id"] = str(assignment["_id"])
            assignments.append(Assignment(**assignment))
        return assignments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching assignments: {str(e)}")

@app.get("/api/tasks", response_model=List[Task])
async def get_tasks(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get all tasks for the current user"""
    try:
        tasks = []
        async for task in db.tasks.find({"user_id": current_user["id"]}):
            task["_id"] = str(task["_id"])
            tasks.append(Task(**task))
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")

@app.put("/api/tasks/{task_id}/complete")
async def complete_task(
    task_id: str,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Mark a task as completed"""
    try:
        result = await db.tasks.update_one(
            {"id": task_id, "user_id": current_user["id"]},
            {"$set": {"completed": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return {"message": "Task completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error completing task: {str(e)}")

@app.put("/api/tasks/{task_id}/reschedule")
async def reschedule_task(
    task_id: str,
    new_date: str,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Reschedule a task to a new date"""
    try:
        result = await db.tasks.update_one(
            {"id": task_id, "user_id": current_user["id"]},
            {"$set": {"scheduled_date": new_date, "completed": False}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return {"message": "Task rescheduled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error rescheduling task: {str(e)}")

@app.get("/api/daily-plan/{date}")
async def get_daily_plan(
    date: str,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get daily plan for a specific date"""
    try:
        tasks = []
        async for task in db.tasks.find({"user_id": current_user["id"], "scheduled_date": date}):
            task["_id"] = str(task["_id"])
            tasks.append(Task(**task))
        
        plan = AIScheduler.generate_daily_plan(tasks, date)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching daily plan: {str(e)}")

@app.get("/api/profile", response_model=StudyProfile)
async def get_profile(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get user's study profile"""
    try:
        user = await db.users.find_one({"id": current_user["id"]})
        if not user:
            # Return default profile
            return StudyProfile()
        return StudyProfile(**user["study_profile"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")

@app.put("/api/profile")
async def update_profile(
    profile: StudyProfile,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Update user's study profile"""
    try:
        result = await db.users.update_one(
            {"id": current_user["id"]},
            {"$set": {"study_profile": profile.dict()}},
            upsert=True
        )
        return {"message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating profile: {str(e)}")

@app.post("/api/timer-sessions", response_model=TimerSession)
async def create_timer_session(
    session: TimerSession,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Create a new timer session"""
    try:
        session.user_id = current_user["id"]
        session.id = str(uuid.uuid4())
        
        await db.timer_sessions.insert_one(session.dict())
        
        # Update wallet points
        wallet = await db.wallets.find_one({"user_id": current_user["id"]})
        if not wallet:
            wallet = UserWallet(user_id=current_user["id"]).dict()
        
        wallet["total_points"] += session.points_earned
        wallet["sessions_completed"] += 1
        wallet["total_study_time"] += session.duration
        
        await db.wallets.update_one(
            {"user_id": current_user["id"]},
            {"$set": wallet},
            upsert=True
        )
        
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating timer session: {str(e)}")

@app.get("/api/wallet", response_model=UserWallet)
async def get_wallet(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get user's wallet information"""
    try:
        wallet = await db.wallets.find_one({"user_id": current_user["id"]})
        if not wallet:
            wallet = UserWallet(user_id=current_user["id"])
            await db.wallets.insert_one(wallet.dict())
            return wallet
        
        wallet["_id"] = str(wallet["_id"])
        return UserWallet(**wallet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching wallet: {str(e)}")

@app.post("/api/wallet/redeem")
async def redeem_reward(
    tier_points: int,
    amount: float,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Redeem points for rewards"""
    try:
        wallet = await db.wallets.find_one({"user_id": current_user["id"]})
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")
        
        if wallet["total_points"] < tier_points:
            raise HTTPException(status_code=400, detail="Insufficient points")
        
        # Create redemption record
        redemption = {
            "id": str(uuid.uuid4()),
            "points": tier_points,
            "amount": amount,
            "redeemed_at": datetime.now().isoformat()
        }
        
        # Update wallet
        new_total_points = wallet["total_points"] - tier_points
        new_total_earnings = wallet["total_earnings"] + amount
        new_rewards = wallet.get("rewards_redeemed", []) + [redemption]
        
        await db.wallets.update_one(
            {"user_id": current_user["id"]},
            {"$set": {
                "total_points": new_total_points,
                "total_earnings": new_total_earnings,
                "rewards_redeemed": new_rewards
            }}
        )
        
        return {"message": "Reward redeemed successfully", "redemption": redemption}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error redeeming reward: {str(e)}")

@app.get("/api/timer-sessions", response_model=List[TimerSession])
async def get_timer_sessions(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get all timer sessions for the current user"""
    try:
        sessions = []
        async for session in db.timer_sessions.find({"user_id": current_user["id"]}):
            session["_id"] = str(session["_id"])
            sessions.append(TimerSession(**session))
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching timer sessions: {str(e)}")

@app.get("/api/stats")
async def get_stats(
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get user statistics"""
    try:
        # Get tasks
        total_tasks = await db.tasks.count_documents({"user_id": current_user["id"]})
        completed_tasks = await db.tasks.count_documents({"user_id": current_user["id"], "completed": True})
        
        # Get upcoming deadlines (next 7 days)
        today = datetime.now()
        next_week = today + timedelta(days=7)
        upcoming_deadlines = await db.assignments.count_documents({
            "user_id": current_user["id"],
            "due_date": {
                "$gte": today.isoformat(),
                "$lte": next_week.isoformat()
            }
        })
        
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": completion_rate,
            "upcoming_deadlines": upcoming_deadlines
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

@app.delete("/api/assignments/{assignment_id}")
async def delete_assignment(
    assignment_id: str,
    db=Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Delete an assignment and its associated tasks"""
    try:
        # Delete assignment
        assignment_result = await db.assignments.delete_one({
            "id": assignment_id,
            "user_id": current_user["id"]
        })
        
        if assignment_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        # Delete associated tasks
        await db.tasks.delete_many({
            "assignment_id": assignment_id,
            "user_id": current_user["id"]
        })
        
        return {"message": "Assignment and associated tasks deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting assignment: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)