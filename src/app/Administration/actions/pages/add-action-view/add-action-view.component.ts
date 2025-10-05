import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageActionComponent } from '../../components/manage-action/manage-action.component';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-add-action-view',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, ManageActionComponent],
  templateUrl: './add-action-view.component.html',
  styleUrls: ['./add-action-view.component.scss']
})
export class AddActionViewComponent {

}
