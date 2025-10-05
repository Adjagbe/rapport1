import { Component, LOCALE_ID } from '@angular/core';
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './Shared/Components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderComponent],
  template: `
    <router-outlet />
    <app-loader />
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100dvh;
      }
    `,
  ],
})
export class AppComponent {
  title = 'certification-comptes';
}
