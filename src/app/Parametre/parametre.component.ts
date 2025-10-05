import { Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: 'Parametre',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [
    ``,
  ],
})

export class ParametreComponent {
    #router = inject(Router);
    userListeActions: any;
    
    constructor() {
      this.#router.navigate(["/parametrage/questionnaires"]);
    }
}