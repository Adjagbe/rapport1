// import { Component, inject, OnDestroy, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { BrandComponent } from 'src/app/Shared/Components/brand/brand.component';
// import { MAIN_NAVIGATION_MENU } from '../../Constants/common.constant';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { DashboradIconComponent } from '../../icons/dashborad-icon.component';
// import { CommonUtils } from '../../Utility/common.utils';
// import { Subscription } from 'rxjs';
// import { UserMenuComponent } from '../user-menu/user-menu.component';

// @Component({
//   selector: 'main-nav',
//   standalone: true,
//   imports: [
//     CommonModule,
//     BrandComponent,
//     RouterLink,
//     RouterLinkActive,
//     UserMenuComponent,
//   ],
//   templateUrl: './main-nav.component.html',
//   styleUrls: ['./main-nav.component.scss'],
//   host: {
//     '[class.isCollapsed]': 'isCollapsed',
//   },
// })
// export class MainNavComponent implements OnInit, OnDestroy {
//   #commonUtils = inject(CommonUtils);

//   mainNavigationMenus = MAIN_NAVIGATION_MENU;
//   isCollapsed = false;
//   toggleNavBarSub!: Subscription;

//   ngOnInit(): void {
//     this.toggleNavBarSub = this.toggleNavBarSub =
//       this.#commonUtils.toggleNavBar$.subscribe(
//         (value) => (this.isCollapsed = value)
//       );
//   }

//   ngOnDestroy(): void {
//     this.toggleNavBarSub?.unsubscribe();
//   }
// }

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandComponent } from 'src/app/Shared/Components/brand/brand.component';
import { MAIN_NAVIGATION_MENU } from '../../Constants/common.constant';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DashboradIconComponent } from '../../icons/dashborad-icon.component';
import { CommonUtils } from '../../Utility/common.utils';
import { Subscription } from 'rxjs';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { AuthorizationService } from '../../Services/authorization/authorization.service';
import { NavigationMenu } from 'src/app/Models/navigation-menu.model';

@Component({
  selector: 'main-nav',
  standalone: true,
  imports: [
    CommonModule,
    BrandComponent,
    RouterLink,
    RouterLinkActive,
    UserMenuComponent,
  ],
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  host: {
    '[class.isCollapsed]': 'isCollapsed',
  },
})
export class MainNavComponent implements OnInit, OnDestroy {
  #commonUtils = inject(CommonUtils);

  #permissionService = inject(AuthorizationService);

  // mainNavigationMenus = MAIN_NAVIGATION_MENU;
  mainNavigationMenus : NavigationMenu [] = [];
  isCollapsed = false;
  toggleNavBarSub!: Subscription;

  ngOnInit(): void {

    // Filtrage des menus selon permissions
    this.mainNavigationMenus = MAIN_NAVIGATION_MENU.filter(menu =>
      this.#permissionService.hasPermission(menu.code)
    );
    console.log('Menus affichés:', this.mainNavigationMenus);


    this.toggleNavBarSub =
      this.#commonUtils.toggleNavBar$.subscribe(
        (value) => (this.isCollapsed = value)
      );
  }

  ngOnDestroy(): void {
    this.toggleNavBarSub?.unsubscribe();
  }
}