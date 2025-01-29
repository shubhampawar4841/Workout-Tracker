// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Workout {
  id: number;
  type: string;
  minutes: number;
  date: Date;
}

export interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'userData';
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);
  private lastUserId = 0;
  private lastWorkoutId = 0;

  constructor() {
    this.loadInitialData();
  }

  // Initialize data from localStorage or set default data
  private loadInitialData(): void {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      this.users = JSON.parse(storedData, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      this.updateIds();
    } else {
      this.setDefaultData();
    }
    this.usersSubject.next(this.users);
  }

  // Set default data if no stored data exists
  private setDefaultData(): void {
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [
          { id: 1, type: 'Running', minutes: 30, date: new Date() },
          { id: 2, type: 'Cycling', minutes: 45, date: new Date() }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        workouts: [
          { id: 3, type: 'Swimming', minutes: 60, date: new Date() },
          { id: 4, type: 'Yoga', minutes: 40, date: new Date() }
        ]
      }
    ];
    this.updateIds();
    this.saveToLocalStorage();
  }

  // Update IDs based on existing data
  private updateIds(): void {
    this.lastUserId = Math.max(...this.users.map(user => user.id), 0);
    this.lastWorkoutId = Math.max(
      ...this.users.flatMap(user => user.workouts.map(w => w.id)),
      0
    );
  }

  // Save current state to localStorage
  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
    this.usersSubject.next(this.users);
  }

  // Get all users
  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  // Get user by ID
  getUserById(id: number): Observable<User | undefined> {
    return this.usersSubject.pipe(
      map(users => users.find(user => user.id === id))
    );
  }

  // Add new workout for existing user or create new user
  addWorkout(name: string, workoutType: string, minutes: number): void {
    const workout: Workout = {
      id: ++this.lastWorkoutId,
      type: workoutType,
      minutes,
      date: new Date()
    };

    let user = this.users.find(u => u.name.toLowerCase() === name.toLowerCase());

    if (user) {
      user.workouts.push(workout);
    } else {
      user = {
        id: ++this.lastUserId,
        name,
        workouts: [workout]
      };
      this.users.push(user);
    }

    this.saveToLocalStorage();
  }

  // Update existing workout
  updateWorkout(userId: number, workoutId: number, updates: Partial<Workout>): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    const workoutIndex = user.workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex === -1) return false;

    user.workouts[workoutIndex] = {
      ...user.workouts[workoutIndex],
      ...updates
    };

    this.saveToLocalStorage();
    return true;
  }

  // Delete workout
  deleteWorkout(userId: number, workoutId: number): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    const initialLength = user.workouts.length;
    user.workouts = user.workouts.filter(w => w.id !== workoutId);

    if (user.workouts.length === initialLength) return false;

    this.saveToLocalStorage();
    return true;
  }

  // Delete user and all their workouts
  deleteUser(userId: number): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== userId);

    if (this.users.length === initialLength) return false;

    this.saveToLocalStorage();
    return true;
  }

  // Get all unique workout types
  getWorkoutTypes(): string[] {
    const types = new Set<string>();
    this.users.forEach(user => {
      user.workouts.forEach(workout => {
        types.add(workout.type);
      });
    });
    return Array.from(types).sort();
  }

  // Get user statistics
  getUserStats(userId: number): Observable<{
    totalWorkouts: number;
    totalMinutes: number;
    averageMinutes: number;
    workoutsByType: { [key: string]: number };
  }> {
    return this.getUserById(userId).pipe(
      map(user => {
        if (!user) throw new Error('User not found');

        const workoutsByType: { [key: string]: number } = {};
        let totalMinutes = 0;

        user.workouts.forEach(workout => {
          totalMinutes += workout.minutes;
          workoutsByType[workout.type] = (workoutsByType[workout.type] || 0) + 1;
        });

        return {
          totalWorkouts: user.workouts.length,
          totalMinutes,
          averageMinutes: totalMinutes / user.workouts.length,
          workoutsByType
        };
      })
    );
  }

  // Clear all data (useful for testing)
  clearAll(): void {
    this.users = [];
    this.lastUserId = 0;
    this.lastWorkoutId = 0;
    this.saveToLocalStorage();
  }
}