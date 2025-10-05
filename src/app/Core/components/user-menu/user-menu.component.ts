import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeDotsIconComponent } from '../../icons/three-dots.icon.component';
import { AccountInfoIconComponent } from '../../icons/account-info-icon.component';
import { ResetPasswordIconComponent } from '../../icons/reset-password-icon.component';
import { LogoutIconComponent } from '../../icons/logout-icon.component';
import { UsersService } from '../../Services/users.service';
import { STORAGE_KEYS } from 'src/app/Models/storage-keys.model';
import { USER_PROFIL } from '../../Constants/common.constant';
import { ReloadIconComponent } from '../../icons';
import { GlobalService } from '../../Services/global/global.service';

@Component({
  selector: 'user-menu',
  standalone: true,
  imports: [
    CommonModule,
    ThreeDotsIconComponent,
    AccountInfoIconComponent,
    ResetPasswordIconComponent,
    LogoutIconComponent,
    ReloadIconComponent
  ],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  #userService = inject(UsersService);
  #globalService = inject(GlobalService)
  infoUser: any;
  users: any;
  userProfil = USER_PROFIL;
  profil: Record<string, string> | null = null;
  showActionMenu = false;
  toggleActionMenu() {
    this.showActionMenu = !this.showActionMenu;
  }

  logout() {
    this.#userService.logout();
  }

  ngOnInit() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    this.infoUser = userData ? JSON.parse(userData) : null;
    
    this.users = this.infoUser?.item;

    this.profil = this.infoUser?.item.profils[0];
    console.log("profil de l'utilisateur ", this.users);

  }

  reload(){
    const session = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    if (!session) return;

    const login = JSON.parse(session)?.item?.login;
    if (!login) return;

    this.#globalService.reloadAllow(login).subscribe({
      next: (response) => {
        // Suppression de l'ancien localStorage
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        // Enregistrement des nouvelles données
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response));
        // Tu peux aussi recharger la page ou rafraîchir les données affichées
        location.reload(); // optionnel
      },
      error: (err) => {
        console.error('Erreur reload:', err);
      }
    });
  }
}
