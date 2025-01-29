import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-workout-form',
  templateUrl: '../workout-form.component.html',
  styleUrls: ['../workout-form.component.scss']
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.workoutForm = this.fb.group({
      userName: ['', Validators.required],
      workoutType: ['', Validators.required],
      workoutMinutes: ['', [Validators.required, Validators.min(1)]],
    });
  }

  submitWorkout() {
    if (this.workoutForm.valid) {
      console.log(this.workoutForm.value);
      this.workoutForm.reset();
    }
  }
}
