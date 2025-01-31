import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([]), provideAnimationsAsync(), // ✅ Add this to enable routing
  ],
}).catch((err) => console.error(err));
