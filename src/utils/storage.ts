import { Assignment, Task, StudyProfile } from '../types';

const STORAGE_KEYS = {
  ASSIGNMENTS: 'deadliner_assignments',
  TASKS: 'deadliner_tasks',
  PROFILE: 'deadliner_profile'
};

export class Storage {
  static saveAssignments(assignments: Assignment[]): void {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }

  static getAssignments(): Assignment[] {
    const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : [];
  }

  static saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  static getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  }

  static saveProfile(profile: StudyProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  static getProfile(): StudyProfile {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : {
      dailyStudyHours: 4,
      preferredStudyTimes: ['morning', 'evening'],
      subjects: ['Math', 'Science', 'History', 'English'],
      studyStyle: 'distributed'
    };
  }

  static exportToPDF(): void {
    // Simulate PDF export
    const assignments = this.getAssignments();
    const tasks = this.getTasks();
    
    const content = `
DEADLINER AI - STUDY SCHEDULE
===============================

Assignments:
${assignments.map(a => `• ${a.title} (${a.subject}) - Due: ${new Date(a.dueDate).toLocaleDateString()}`).join('\n')}

Upcoming Tasks:
${tasks.filter(t => !t.completed && new Date(t.scheduledDate) >= new Date())
  .slice(0, 10)
  .map(t => `• ${t.title} - ${new Date(t.scheduledDate).toLocaleDateString()} (${t.duration}min)`)
  .join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deadliner-schedule.txt';
    a.click();
    URL.revokeObjectURL(url);
  }
}