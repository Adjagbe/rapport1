import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from "src/app/Core/layouts/main-layout/main-layout.component";
import { GestionReponseOverviewComponent } from "../../components/gestion-reponse-overview/gestion-reponse-overview.component";

@Component({
  selector: 'app-reponse-management',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, GestionReponseOverviewComponent],
  templateUrl: './reponse-management.component.html',
  styleUrls: ['./reponse-management.component.scss']
})
export class ReponseManagementComponent {

}
