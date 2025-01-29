import { Routes } from '@angular/router';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';

export const routes: Routes = [
  { path: '', component: WorkoutFormComponent }  // Root route points to the WorkoutFormComponent
];
