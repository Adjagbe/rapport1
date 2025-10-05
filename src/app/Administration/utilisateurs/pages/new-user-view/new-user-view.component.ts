import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UserRequestFormComponent } from '../../components/user-request-form/user-request-form.component';
import { MainLayoutComponent } from 'src/app/Core/layouts/main-layout/main-layout.component';

@Component({
  selector: 'new-user-view',
  standalone: true,
  imports: [
    CommonModule, 
    // UserRequestFormComponent, 
    MainLayoutComponent],
  templateUrl: './new-user-view.component.html',
  styleUrls: ['./new-user-view.component.scss'],
})
export class NewUserViewComponent {}
