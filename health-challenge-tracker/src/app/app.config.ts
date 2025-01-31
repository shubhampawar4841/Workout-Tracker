import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideCharts,
  withDefaultRegisterables,
  } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideCharts(withDefaultRegisterables()),
     // ✅ Ensure routing is provided
  ],
};
