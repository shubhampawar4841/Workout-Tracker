// src/app/components/workout-chart/workout-chart.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-workout-chart',
  template: `
    <div class="p-4 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Workout Progress</h2>
      <div class="h-96">
        <div [id]="chartId"></div>
      </div>
    </div>
  `
})
export class WorkoutChartComponent implements OnInit {
  chartId = 'workout-chart';
  chartData: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      const workoutsByType = new Map<string, number>();
      
      users.forEach(user => {
        user.workouts.forEach(workout => {
          const current = workoutsByType.get(workout.type) || 0;
          workoutsByType.set(workout.type, current + workout.minutes);
        });
      });

      this.chartData = Array.from(workoutsByType.entries()).map(([type, minutes]) => ({
        name: type,
        value: minutes
      }));

      this.renderChart();
    });
  }

  private renderChart(): void {
    const data = {
      labels: this.chartData.map(item => item.name),
      datasets: [{
        data: this.chartData.map(item => item.value),
        backgroundColor: [
          '#4C51BF',
          '#48BB78',
          '#ED8936',
          '#9F7AEA'
        ]
      }]
    };

    const config = {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Total Minutes by Workout Type'
          }
        }
      }
    };

    // Note: You'll need to add Chart.js to your project and use it here
    // new Chart(document.getElementById(this.chartId), config);
  }
}