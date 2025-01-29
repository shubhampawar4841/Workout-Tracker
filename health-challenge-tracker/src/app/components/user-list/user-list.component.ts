// src/app/components/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  template: `
    <div class="p-4">
      <div class="mb-4 flex gap-4">
        <div class="flex-1">
          <input
            [formControl]="searchControl"
            placeholder="Search by name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div class="flex-1">
          <select
            [formControl]="filterControl"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All workout types</option>
            <option *ngFor="let type of workoutTypes" [value]="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workout Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Minutes
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let user of displayedUsers">
              <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
              <td class="px-6 py-4">
                <div *ngFor="let workout of user.workouts">
                  {{ workout.type }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div *ngFor="let workout of user.workouts">
                  {{ workout.minutes }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredUsers.length }} entries
        </div>
        <div class="flex gap-2">
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 1"
            class="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            (click)="nextPage()"
            [disabled]="currentPage === totalPages"
            class="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedUsers: User[] = [];
  workoutTypes: string[] = [];
  searchControl = new FormControl('');
  filterControl = new FormControl('');
  
  currentPage = 1;
  pageSize = 5;
  
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  
  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredUsers.length);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.applyFilters();
    });

    this.workoutTypes = this.userService.getWorkoutTypes();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());

    this.filterControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    let filtered = this.users;
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const filterType = this.filterControl.value || '';

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
      );
    }

    if (filterType) {
      filtered = filtered.filter(user =>
        user.workouts.some(workout => workout.type === filterType)
      );
    }

    this.filteredUsers = filtered;
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers(): void {
    this.displayedUsers = this.filteredUsers.slice(
      this.startIndex,
      this.endIndex
    );
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedUsers();
    }
  }
}