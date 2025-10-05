import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UsersService } from '../Core/Services/users.service';

@Component({
  selector: 'administration',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [
    `
    `,
  ],
})
export class AdministrationComponent {
  #router = inject(Router);
  #userService = inject(UsersService)
  userListeActions: any;

  constructor() {
    // const admin = this.#userService.getActionUser(
    //   'ADMINISTRATION'
    // );
    // this.userListeActions =  (val: any) => admin?.findIndex((elt: { code: any; }) => elt.code === val) > -1;

    // if(this.userListeActions('UTILISATEUR')){
      this.#router.navigate(["/administration/utilisateurs"]);
    // } else if(this.userListeActions('PROFIL')){
    //   this.#router.navigate(["/administration/profils"]);
    // } else if(this.userListeActions('ACTION')){
    //   this.#router.navigate(["/administration/actions"]);
    // }
  }
}
