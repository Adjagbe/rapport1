import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPreviewCardModel } from 'src/app/Models/user.model';

@Component({
  selector: 'utilisateurs-infos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './utilisateurs-infos.component.html',
  styleUrls: ['./utilisateurs-infos.component.scss'],
})
export class UtilisateurInfosComponent {
  @Input() selectedUser: UserPreviewCardModel | null = null;
  
}
