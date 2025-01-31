import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WorkoutData {
  name: string;
  workouts: string[];
  numberOfWorkouts: number;
  totalWorkoutMinutes: number;
}

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workout-list.component.html', // Reference to external HTML file
})
export class WorkoutListComponent implements OnInit {
  workouts: WorkoutData[] = [];
  filteredWorkouts: WorkoutData[] = [];
  workoutTypes: string[] = []; // Array to store unique workout types
  currentPage = 1;
  itemsPerPage = 5;
  searchTerm = '';
  selectedWorkoutType = '';

  ngOnInit() {
    this.loadWorkouts();
  }

  loadWorkouts() {
    try {
      const storedData = localStorage.getItem('workoutData');
      this.workouts = storedData ? JSON.parse(storedData) : [];
      this.extractWorkoutTypes();
      this.applyFilters();
    } catch (error) {
      console.error('Error loading workouts:', error);
      this.workouts = [];
      this.applyFilters();
    }
  }

  extractWorkoutTypes() {
    const allWorkouts = this.workouts.flatMap(workout => workout.workouts);
    this.workoutTypes = [...new Set(allWorkouts)]; // Extract unique workout types
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedWorkoutType = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.workouts];

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(workout =>
        workout?.name?.toLowerCase().includes(this.searchTerm) ||
        workout?.workouts?.some(w => w?.toLowerCase().includes(this.searchTerm))
      );
    }

    // Filter by workout type if selected
    if (this.selectedWorkoutType) {
      filtered = filtered.filter(workout =>
        workout.workouts.some(w => w.toLowerCase() === this.selectedWorkoutType.toLowerCase())
      );
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredWorkouts = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  hasNextPage(): boolean {
    return this.currentPage < Math.ceil(this.workouts.length / this.itemsPerPage);
  }
}
