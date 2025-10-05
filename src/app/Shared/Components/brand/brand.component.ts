import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'brand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
  host: {
    '[class.isCollapsed]': 'isCollapsed',
  },
})
export class BrandComponent implements OnInit, OnDestroy {
  #commonUtils = inject(CommonUtils);
  isCollapsed = false;
  toggleNavBarSub!: Subscription;

  ngOnInit(): void {
    this.toggleNavBarSub = this.#commonUtils.toggleNavBar$.subscribe(
      (value) => (this.isCollapsed = value)
    );
  }

  toggleMainNav() {
    const oldValue = this.#commonUtils.navBarValue;
    this.#commonUtils.setToggleNavBar(!oldValue);
  }

  ngOnDestroy(): void {
    this.toggleNavBarSub?.unsubscribe();
  }
}
