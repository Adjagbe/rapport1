import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageProfilsComponent } from '../../components/manage-profils/manage-profils.component';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-add-profils-view',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, ManageProfilsComponent],
  templateUrl: './add-profils-view.component.html',
  styleUrls: ['./add-profils-view.component.scss'],
})
export class AddProfilsViewComponent {}
