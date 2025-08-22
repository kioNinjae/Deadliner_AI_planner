import { Assignment, Task, StudyProfile, DayPlan } from '../types';

export class AIScheduler {
  static generateTaskBreakdown(assignment: Assignment, profile: StudyProfile): Task[] {
    const tasks: Task[] = [];
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    const totalMinutes = assignment.estimatedHours * 60;
    const maxDailyMinutes = profile.dailyStudyHours * 60 * 0.6; // Use 60% of daily study time for this assignment
    
    if (assignment.type === 'exam') {
      return this.generateExamTasks(assignment, daysUntilDue, totalMinutes, maxDailyMinutes);
    } else if (assignment.type === 'project') {
      return this.generateProjectTasks(assignment, daysUntilDue, totalMinutes, maxDailyMinutes);
    } else {
      return this.generateAssignmentTasks(assignment, daysUntilDue, totalMinutes, maxDailyMinutes);
    }
  }

  private static generateExamTasks(assignment: Assignment, days: number, totalMinutes: number, maxDaily: number): Task[] {
    const tasks: Task[] = [];
    const studyDays = Math.max(1, days - 1); // Leave last day for review
    const dailyStudyTime = Math.min(totalMinutes / studyDays, maxDaily);
    
    for (let i = 0; i < studyDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      if (i === 0) {
        tasks.push({
          id: `${assignment.id}-review-${i}`,
          assignmentId: assignment.id,
          title: `📚 Review ${assignment.subject} materials`,
          description: `Review notes and textbook chapters for ${assignment.title}`,
          scheduledDate: date.toISOString().split('T')[0],
          duration: dailyStudyTime,
          completed: false,
          type: 'study',
          priority: assignment.priority
        });
      } else if (i === studyDays - 1) {
        tasks.push({
          id: `${assignment.id}-final-review-${i}`,
          assignmentId: assignment.id,
          title: `🎯 Final review for ${assignment.subject}`,
          description: `Practice problems and final review for ${assignment.title}`,
          scheduledDate: date.toISOString().split('T')[0],
          duration: dailyStudyTime,
          completed: false,
          type: 'study',
          priority: 'high'
        });
      } else {
        tasks.push({
          id: `${assignment.id}-study-${i}`,
          assignmentId: assignment.id,
          title: `📖 Study ${assignment.subject}`,
          description: `Deep study session for ${assignment.title}`,
          scheduledDate: date.toISOString().split('T')[0],
          duration: dailyStudyTime,
          completed: false,
          type: 'study',
          priority: assignment.priority
        });
      }
    }

    // Add reminder task
    const reminderDate = new Date(assignment.dueDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    tasks.push({
      id: `${assignment.id}-reminder`,
      assignmentId: assignment.id,
      title: `🔄 Final prep reminder`,
      description: `Tomorrow is your ${assignment.title}! Review key concepts.`,
      scheduledDate: reminderDate.toISOString().split('T')[0],
      duration: 15,
      completed: false,
      type: 'reminder',
      priority: 'high'
    });

    return tasks;
  }

  private static generateProjectTasks(assignment: Assignment, days: number, totalMinutes: number, maxDaily: number): Task[] {
    const tasks: Task[] = [];
    const phases = ['Planning & Research', 'Implementation', 'Review & Polish'];
    const phaseDistribution = [0.3, 0.5, 0.2];
    
    let dayOffset = 0;
    phases.forEach((phase, phaseIndex) => {
      const phaseMinutes = totalMinutes * phaseDistribution[phaseIndex];
      const phaseDays = Math.ceil(days * phaseDistribution[phaseIndex]);
      const dailyTime = Math.min(phaseMinutes / phaseDays, maxDaily);
      
      for (let i = 0; i < phaseDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset + i);
        
        tasks.push({
          id: `${assignment.id}-${phase.toLowerCase().replace(/\s+/g, '-')}-${i}`,
          assignmentId: assignment.id,
          title: `📝 ${phase}: ${assignment.title}`,
          description: `Work on ${phase.toLowerCase()} phase of ${assignment.title}`,
          scheduledDate: date.toISOString().split('T')[0],
          duration: dailyTime,
          completed: false,
          type: 'assignment',
          priority: assignment.priority
        });
      }
      
      dayOffset += phaseDays;
    });

    return tasks;
  }

  private static generateAssignmentTasks(assignment: Assignment, days: number, totalMinutes: number, maxDaily: number): Task[] {
    const tasks: Task[] = [];
    const workDays = Math.max(1, days - 1);
    const dailyTime = Math.min(totalMinutes / workDays, maxDaily);
    
    for (let i = 0; i < workDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      tasks.push({
        id: `${assignment.id}-work-${i}`,
        assignmentId: assignment.id,
        title: `📝 Work on ${assignment.title}`,
        description: `Continue working on ${assignment.title} for ${assignment.subject}`,
        scheduledDate: date.toISOString().split('T')[0],
        duration: dailyTime,
        completed: false,
        type: 'assignment',
        priority: assignment.priority
      });
    }

    return tasks;
  }

  static rescheduleTask(task: Task, newDate: string): Task {
    return {
      ...task,
      scheduledDate: newDate,
      completed: false
    };
  }

  static generateDailyPlan(tasks: Task[], date: string): DayPlan {
    const dayTasks = tasks.filter(task => task.scheduledDate === date);
    const totalTime = dayTasks.reduce((sum, task) => sum + task.duration, 0);
    
    return {
      date,
      tasks: dayTasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }),
      totalStudyTime: totalTime,
      completed: dayTasks.every(task => task.completed)
    };
  }
}