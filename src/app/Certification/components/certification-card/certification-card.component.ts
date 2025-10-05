import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import {
  Campagnes,
  CAMPAGNES_STATUS_ENUM,
} from 'src/app/Models/gestion-campagnes.model';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { PreviewIconComponent } from 'src/app/Core/icons/preview-icon.component';

@Component({
  selector: 'certification-card',
  standalone: true,
  imports: [CommonModule, BtnGenericComponent, PreviewIconComponent],
  templateUrl: './certification-card.component.html',
  styleUrls: ['./certification-card.component.scss'],
  host: {
    '(click)': 'onEmitCampagne($event)',
  },
})
export class CertificationCardComponent {
  #renderer = inject(Renderer2);
  #host = inject(ElementRef<HTMLElement>);
  #commonUtils = inject(CommonUtils);
  #gestionCampagneService = inject(GestionCampagnesService);

  CAMPAGNES_STATUS_ENUM = CAMPAGNES_STATUS_ENUM;
  // Mapping for status display in French
  statusDisplayMap: Record<string, string> = {
    PLANIFIE: 'Planifiée',
    ACTIVE: 'Active',
    CLOTURE: 'Clôturée',
    DESACTIVE: 'Désactivée',
    TERMINATE: 'Terminé',
  };

  getStatusLabel(status?: string | null): string {
    if (status && this.statusDisplayMap[status]) {
      return this.statusDisplayMap[status];
    }
    return '--';
  }
  @Input() campagne: Partial<Campagnes> | null = null;
  @Output() emitCampagne = new EventEmitter<void>();

  onEmitCampagne(e: Event) {
    e.stopPropagation();
    this.emitCampagne.emit();
  }
}
