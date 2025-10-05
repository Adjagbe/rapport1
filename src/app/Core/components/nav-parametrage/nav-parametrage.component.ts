import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'nav-parametrage',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `<button class="btnStatus">
    <a *ngFor="let parametre of Parametrage" [routerLinkActive]="'link-active'">
      <span class="btn" [routerLink]="parametre.lien">{{ parametre.label }}</span>
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

export class NavParametrageComponent {
    Parametrage = [
    { lien: '/parametrage/questionnaires', label: 'Questionnaire', code: 'QUESTIONNAIRE' },
    { lien: '/parametrage/plateformes', label: 'Plateforme', code: 'PLATEFORME' },
    { lien: '/parametrage/directions', label: 'Paramétrage de direction', code: 'DIRECTION' },
  ];

//   #userService = inject(UsersService)
  userListeActions: any;

  constructor() {
  }
}
