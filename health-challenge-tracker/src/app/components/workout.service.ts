import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Workout {
  userName: string;
  workoutType: string;
  workoutMinutes: number;
}

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private workouts: Workout[] = [];
  private workoutsSubject = new BehaviorSubject<Workout[]>(this.workouts);
  workouts$ = this.workoutsSubject.asObservable();

  addWorkout(workout: Workout) {
    this.workouts.push(workout);
    this.workoutsSubject.next(this.workouts);
  }

  searchWorkouts(searchTerm: string) {
    return this.workouts.filter((workout) =>
      workout.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filterWorkoutsByType(type: string) {
    return type === 'All' ? this.workouts : this.workouts.filter(workout => workout.workoutType === type);
  }

  paginateWorkouts(page: number, pageSize: number) {
    return this.workouts.slice(page * pageSize, (page + 1) * pageSize);
  }
}
