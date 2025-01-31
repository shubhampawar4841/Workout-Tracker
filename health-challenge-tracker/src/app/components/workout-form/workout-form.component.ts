import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface WorkoutData {
  name: string;
  workouts: string[];
  workoutMinutes: number[];
  numberOfWorkouts: number;
  totalWorkoutMinutes: number;
}

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workout-form.component.html'  // Link to the separate HTML file
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;
  workoutTypes = ['Running', 'Cycling', 'Swimming', 'Yoga'];
  availableWorkoutTypes: string[] = [...this.workoutTypes];

  constructor(private fb: FormBuilder) {
    this.workoutForm = this.fb.group({
      userName: ['', Validators.required],
      workoutType: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      const formData = this.workoutForm.value;
      const storedData = localStorage.getItem('workoutData');
      let workouts: WorkoutData[] = storedData ? JSON.parse(storedData) : [];

      const existingUserIndex = workouts.findIndex((w: WorkoutData) => w.name.toLowerCase() === formData.userName.toLowerCase());

      if (existingUserIndex !== -1) {
        workouts[existingUserIndex].workouts.push(formData.workoutType);
        workouts[existingUserIndex].workoutMinutes.push(Number(formData.minutes));
        workouts[existingUserIndex].numberOfWorkouts += 1;
        workouts[existingUserIndex].totalWorkoutMinutes += Number(formData.minutes);
      } else {
        workouts.push({
          name: formData.userName,
          workouts: [formData.workoutType],
          workoutMinutes: [Number(formData.minutes)],
          numberOfWorkouts: 1,
          totalWorkoutMinutes: Number(formData.minutes),
        });
      }

      localStorage.setItem('workoutData', JSON.stringify(workouts));
      this.updateAvailableWorkoutTypes(formData.userName);
      console.log('Updated Workouts Data:', workouts);
      this.workoutForm.reset();
      alert('Workout added successfully!');
    }
  }

  updateAvailableWorkoutTypes(userName: string) {
    const storedData = localStorage.getItem('workoutData');
    let workouts: WorkoutData[] = storedData ? JSON.parse(storedData) : [];

    const user = workouts.find((w: WorkoutData) => w.name.toLowerCase() === userName.toLowerCase());
    if (user) {
      const selectedWorkouts = user.workouts;
      this.availableWorkoutTypes = this.workoutTypes.filter(type => !selectedWorkouts.includes(type));
    }
    window.location.reload();
  }

}
