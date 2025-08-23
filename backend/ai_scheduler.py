from typing import List
from models import Assignment, Task, StudyProfile
from datetime import datetime, timedelta
import uuid

class AIScheduler:
    @staticmethod
    def generate_task_breakdown(assignment: Assignment, profile: StudyProfile) -> List[Task]:
        """Generate AI-powered task breakdown for an assignment"""
        tasks = []
        due_date = datetime.fromisoformat(assignment.due_date.replace('Z', '+00:00'))
        now = datetime.now()
        days_until_due = max(1, (due_date - now).days)
        
        total_minutes = int(assignment.estimated_hours * 60)
        max_daily_minutes = int(profile.daily_study_hours * 60 * 0.6)  # 60% of daily study time
        
        if assignment.type == 'exam':
            return AIScheduler._generate_exam_tasks(assignment, days_until_due, total_minutes, max_daily_minutes)
        elif assignment.type == 'project':
            return AIScheduler._generate_project_tasks(assignment, days_until_due, total_minutes, max_daily_minutes)
        else:
            return AIScheduler._generate_assignment_tasks(assignment, days_until_due, total_minutes, max_daily_minutes)

    @staticmethod
    def _generate_exam_tasks(assignment: Assignment, days: int, total_minutes: int, max_daily: int) -> List[Task]:
        tasks = []
        study_days = max(1, days - 1)  # Leave last day for review
        daily_study_time = min(total_minutes // study_days, max_daily)
        
        for i in range(study_days):
            date = datetime.now() + timedelta(days=i)
            
            if i == 0:
                task_title = f"📚 Review {assignment.subject} materials"
                description = f"Review notes and textbook chapters for {assignment.title}"
            elif i == study_days - 1:
                task_title = f"🎯 Final review for {assignment.subject}"
                description = f"Practice problems and final review for {assignment.title}"
            else:
                task_title = f"📖 Study {assignment.subject}"
                description = f"Deep study session for {assignment.title}"
            
            task = Task(
                id=str(uuid.uuid4()),
                assignment_id=assignment.id,
                title=task_title,
                description=description,
                scheduled_date=date.strftime('%Y-%m-%d'),
                duration=daily_study_time,
                completed=False,
                type='study',
                priority=assignment.priority,
                user_id=assignment.user_id
            )
            tasks.append(task)
        
        # Add reminder task
        reminder_date = datetime.fromisoformat(assignment.due_date.replace('Z', '+00:00')) - timedelta(days=1)
        reminder_task = Task(
            id=str(uuid.uuid4()),
            assignment_id=assignment.id,
            title="🔄 Final prep reminder",
            description=f"Tomorrow is your {assignment.title}! Review key concepts.",
            scheduled_date=reminder_date.strftime('%Y-%m-%d'),
            duration=15,
            completed=False,
            type='reminder',
            priority='high',
            user_id=assignment.user_id
        )
        tasks.append(reminder_task)
        
        return tasks

    @staticmethod
    def _generate_project_tasks(assignment: Assignment, days: int, total_minutes: int, max_daily: int) -> List[Task]:
        tasks = []
        phases = ['Planning & Research', 'Implementation', 'Review & Polish']
        phase_distribution = [0.3, 0.5, 0.2]
        
        day_offset = 0
        for phase_index, phase in enumerate(phases):
            phase_minutes = int(total_minutes * phase_distribution[phase_index])
            phase_days = max(1, int(days * phase_distribution[phase_index]))
            daily_time = min(phase_minutes // phase_days, max_daily)
            
            for i in range(phase_days):
                date = datetime.now() + timedelta(days=day_offset + i)
                
                task = Task(
                    id=str(uuid.uuid4()),
                    assignment_id=assignment.id,
                    title=f"📝 {phase}: {assignment.title}",
                    description=f"Work on {phase.lower()} phase of {assignment.title}",
                    scheduled_date=date.strftime('%Y-%m-%d'),
                    duration=daily_time,
                    completed=False,
                    type='assignment',
                    priority=assignment.priority,
                    user_id=assignment.user_id
                )
                tasks.append(task)
            
            day_offset += phase_days
        
        return tasks

    @staticmethod
    def _generate_assignment_tasks(assignment: Assignment, days: int, total_minutes: int, max_daily: int) -> List[Task]:
        tasks = []
        work_days = max(1, days - 1)
        daily_time = min(total_minutes // work_days, max_daily)
        
        for i in range(work_days):
            date = datetime.now() + timedelta(days=i)
            
            task = Task(
                id=str(uuid.uuid4()),
                assignment_id=assignment.id,
                title=f"📝 Work on {assignment.title}",
                description=f"Continue working on {assignment.title} for {assignment.subject}",
                scheduled_date=date.strftime('%Y-%m-%d'),
                duration=daily_time,
                completed=False,
                type='assignment',
                priority=assignment.priority,
                user_id=assignment.user_id
            )
            tasks.append(task)
        
        return tasks

    @staticmethod
    def reschedule_task(task: Task, new_date: str) -> Task:
        """Reschedule a task to a new date"""
        task.scheduled_date = new_date
        task.completed = False
        return task

    @staticmethod
    def generate_daily_plan(tasks: List[Task], date: str) -> dict:
        """Generate a daily plan for a specific date"""
        day_tasks = [task for task in tasks if task.scheduled_date == date]
        total_time = sum(task.duration for task in day_tasks)
        
        # Sort by priority
        priority_order = {'high': 3, 'medium': 2, 'low': 1}
        day_tasks.sort(key=lambda x: priority_order[x.priority], reverse=True)
        
        return {
            'date': date,
            'tasks': day_tasks,
            'total_study_time': total_time,
            'completed': all(task.completed for task in day_tasks) if day_tasks else False
        }