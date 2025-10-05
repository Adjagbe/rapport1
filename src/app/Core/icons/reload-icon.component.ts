import { Component, Input } from '@angular/core';

@Component({
  selector: '.reload-icon',
  standalone: true,
  imports: [],
  template: `<svg
    [class.rotating]="isRotating"
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    [class.rotating]="loading"
  >
    <path
      d="M12.05 20.5C9.81667 20.5 7.91667 19.725 6.35 18.175C4.78333 16.625 4 14.7333 4 12.5V12.325L2.4 13.925L1 12.525L5 8.525L9 12.525L7.6 13.925L6 12.325V12.5C6 14.1667 6.5875 15.5833 7.7625 16.75C8.9375 17.9167 10.3667 18.5 12.05 18.5C12.4833 18.5 12.9083 18.45 13.325 18.35C13.7417 18.25 14.15 18.1 14.55 17.9L16.05 19.4C15.4167 19.7667 14.7667 20.0417 14.1 20.225C13.4333 20.4083 12.75 20.5 12.05 20.5ZM19 16.475L15 12.475L16.4 11.075L18 12.675V12.5C18 10.8333 17.4125 9.41667 16.2375 8.25C15.0625 7.08333 13.6333 6.5 11.95 6.5C11.5167 6.5 11.0917 6.55 10.675 6.65C10.2583 6.75 9.85 6.9 9.45 7.1L7.95 5.6C8.58333 5.23333 9.23333 4.95833 9.9 4.775C10.5667 4.59167 11.25 4.5 11.95 4.5C14.1833 4.5 16.0833 5.275 17.65 6.825C19.2167 8.375 20 10.2667 20 12.5V12.675L21.6 11.075L23 12.475L19 16.475Z"
      fill="currentColor"
    />
  </svg>`,
  styles: [
    `
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .rotating {
        animation: rotate 1s linear infinite;
      }
    `,
  ],
})
export class ReloadIconComponent {
  @Input() clr: 'white' | 'black' = 'black';
  @Input() loading: boolean = false;

  @Input() isRotating: boolean = false;
}
