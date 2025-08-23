import axios from 'axios';
import { Assignment, Task, StudyProfile, TimerSession, UserWallet } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer demo-token' // Mock token for demo
  }
});

export class ApiService {
  // Assignments
  static async createAssignment(assignment: Omit<Assignment, 'id' | 'createdAt' | 'completed'>): Promise<Assignment> {
    const response = await api.post('/api/assignments', assignment);
    return response.data;
  }

  static async getAssignments(): Promise<Assignment[]> {
    const response = await api.get('/api/assignments');
    return response.data;
  }

  static async deleteAssignment(assignmentId: string): Promise<void> {
    await api.delete(`/api/assignments/${assignmentId}`);
  }

  // Tasks
  static async getTasks(): Promise<Task[]> {
    const response = await api.get('/api/tasks');
    return response.data;
  }

  static async completeTask(taskId: string): Promise<void> {
    await api.put(`/api/tasks/${taskId}/complete`);
  }

  static async rescheduleTask(taskId: string, newDate: string): Promise<void> {
    await api.put(`/api/tasks/${taskId}/reschedule?new_date=${newDate}`);
  }

  static async getDailyPlan(date: string): Promise<any> {
    const response = await api.get(`/api/daily-plan/${date}`);
    return response.data;
  }

  // Profile
  static async getProfile(): Promise<StudyProfile> {
    const response = await api.get('/api/profile');
    return response.data;
  }

  static async updateProfile(profile: StudyProfile): Promise<void> {
    await api.put('/api/profile', profile);
  }

  // Timer Sessions
  static async createTimerSession(session: TimerSession): Promise<TimerSession> {
    const response = await api.post('/api/timer-sessions', session);
    return response.data;
  }

  static async getTimerSessions(): Promise<TimerSession[]> {
    const response = await api.get('/api/timer-sessions');
    return response.data;
  }

  // Wallet
  static async getWallet(): Promise<UserWallet> {
    const response = await api.get('/api/wallet');
    return response.data;
  }

  static async redeemReward(tierPoints: number, amount: number): Promise<any> {
    const response = await api.post('/api/wallet/redeem', {
      tier_points: tierPoints,
      amount: amount
    });
    return response.data;
  }

  // Stats
  static async getStats(): Promise<any> {
    const response = await api.get('/api/stats');
    return response.data;
  }
}

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);