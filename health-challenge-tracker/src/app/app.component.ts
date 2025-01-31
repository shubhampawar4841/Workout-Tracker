import { Component } from '@angular/core';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { WorkoutChartComponent } from './components/workout-chart/workout-chart.component';
import {Chart,registerables} from 'chart.js'

Chart.register(...registerables);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkoutFormComponent, WorkoutListComponent, WorkoutChartComponent], // ✅ Add WorkoutChartComponent
  template: `
<main>
  <header class="brand-name text-6xl font-extrabold text-gray-800 text-center mt-8">
    Workout-Tracker
  </header>
  <section class="content">
    <app-workout-form></app-workout-form>
    <app-workout-list></app-workout-list>
    <app-workout-chart></app-workout-chart>  <!-- ✅ Add Chart Component -->
  </section>
</main>

  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Workout Tracker';
}
