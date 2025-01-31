import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Dummy data for illustration
  getUsers(): Observable<any[]> {
    return of([
      { workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 20 }] },
      { workouts: [{ type: 'Running', minutes: 40 }, { type: 'Yoga', minutes: 60 }] },
      // Add more users and their workouts
    ]);
  }
}
