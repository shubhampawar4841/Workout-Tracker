import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface WorkoutData {
  name: string;
  workouts: string[];
  workoutMinutes: number[];
}

@Component({
  selector: 'app-workout-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-between gap-8 p-6 max-w-6xl mx-auto">
      <div class="flex-1 max-w-xs p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-center mb-4">Select a User:</h2>
        <ul class="space-y-3">
          <li *ngFor="let user of workoutData" 
              (click)="selectUser(user)"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer text-center hover:bg-blue-700">
            {{ user.name }}
          </li>
        </ul>
      </div>

      <div *ngIf="selectedUser" class="flex-3 max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-center mb-4">{{ selectedUser.name }}'s Workout Progress</h3>
        <canvas id="workoutChart" class="w-full h-96 bg-gray-100 rounded-lg"></canvas>
      </div>
    </div>
  `,
  styles: []
})
export class WorkoutChartComponent implements OnInit, OnDestroy {
  private chart: any;
  workoutData: WorkoutData[] = [];
  selectedUser: WorkoutData | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Initializing WorkoutChartComponent...');
    this.loadChartData();
  }

  loadChartData() {
    try {
      const storedData = localStorage.getItem('workoutData');
      console.log('Loaded data from localStorage:', storedData);

      if (storedData) {
        this.workoutData = JSON.parse(storedData);
      } else {
        console.log('No workout data found in localStorage.');
      }
    } catch (error) {
      console.error('Error loading workout data:', error);
    }
  }

  selectUser(user: WorkoutData) {
    console.log('Selected user:', user);
    this.selectedUser = user;

    // Trigger change detection to ensure the DOM updates after the selection
    this.cdr.detectChanges();

    this.createChart(user);
  }

  createChart(user: WorkoutData) {
    const canvas = document.getElementById('workoutChart') as HTMLCanvasElement;
    if (!canvas) {
      console.log('Canvas element not found!');
      return;
    }

    if (this.chart) {
      console.log('Destroying existing chart...');
      this.chart.destroy();
    }

    console.log('Creating chart for:', user.name);

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: user.workouts,
        datasets: [
          {
            label: 'Minutes per Workout',
            data: user.workoutMinutes,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${user.name}'s Workout Breakdown`
          },
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Workout Sessions'
            }
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      console.log('Destroying chart on component destroy...');
      this.chart.destroy();
    }
  }
}
