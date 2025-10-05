import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersService } from '../../Services/users.service';
import { AuthorizationService } from '../../Services/authorization/authorization.service';

@Component({
  selector: 'nav-administration',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `<button class="btnStatus">
    <a *ngFor="let admin of Administration" [routerLinkActive]="'link-active'">
      <span class="btn" [routerLink]="admin.lien">{{ admin.label }}</span>
    </a>
  </button>`,
  styles: [
    `
      .btn {
        padding: 10px 17px;
      }
      .btnStatus {
        padding: 3px;
        background-color: #ffffff;
        border: 3px solid #ececec;
        // margin-bottom: 20px;
        display: flex;
        gap: 35px;
        justify-content: space-between;
        border-radius: 10px;
      }

      .link-active {
        background-color: #000000;
        border-radius: 10px;

        .btn {
          color: #ffffff !important;
        }
      }
    `,
  ],
})
export class NavAdministrationComponent {
  Administration = [
    { lien: '/administration/utilisateurs', label: 'Utilisateurs', code: 'UTILISATEURS' },
    { lien: '/administration/profils', label: 'Profils', code: 'PROFILS' },
    { lien: '/administration/actions', label: 'Actions', code: 'ACTIONS' },
  ];

  #permissionService = inject(AuthorizationService);

  ngOnInit(){
    this.Administration = this.Administration.filter( menu =>
      this.#permissionService.hasPermission(menu.code)
    )
    console.log('Menus administration affiché ', this.Administration);
    
  }

  
  userListeActions: any;

  constructor() {
    // const admin = this.#userService.getActionUser(
    //   'ADMINISTRATION'
    // );
    // this.userListeActions =  (val: any) => admin?.findIndex((elt: { code: any; }) => elt.code === val) > -1;
  }
}
