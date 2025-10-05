import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  Renderer2,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { HistoryIconComponent } from 'src/app/Core/icons/history-icon.component';
import { EditIconComponent } from 'src/app/Core/icons/edit-icon.component';
import { CommonUtils } from 'src/app/Core/Utility/common.utils';
import { PreviewIconComponent } from 'src/app/Core/icons/preview-icon.component';
import {
  Campagnes,
  CAMPAGNES_STATUS_ENUM,
} from 'src/app/Models/gestion-campagnes.model';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateCampagneFormComponent } from '../update-campagne-form/update-campagne-form.component';
import { ValidIconComponent } from 'src/app/Core/icons/valid-icon.component';
import Swal from 'sweetalert2';
import { SpeakerIconComponent } from 'src/app/Core/icons/speaker-icon.component';
import { warningSVG } from 'src/app/Core/Constants/common.constant';
import { Router } from '@angular/router';
import { HasPermissionDirective } from 'src/app/Core/hasPermission/has-permission.directive';

@Component({
  selector: 'campagne-card',
  standalone: true,
  imports: [
    CommonModule,
    BtnGenericComponent,
    HistoryIconComponent,
    EditIconComponent,
    PreviewIconComponent,
    ValidIconComponent,
    SpeakerIconComponent,
    HasPermissionDirective
  ],
  templateUrl: './campagne-card.component.html',
  styleUrls: ['./campagne-card.component.scss'],
  host: {
    '(click)': 'onEmitCampagne()',
  },
})
export class CampagneCardComponent implements AfterViewInit, OnDestroy {
  #renderer = inject(Renderer2);
  #router = inject(Router);
  #host = inject(ElementRef<HTMLElement>);
  #commonUtils = inject(CommonUtils);
  #campagneService = inject(GestionCampagnesService);
  #ngModal = inject(NgbModal);

  CAMPAGNES_STATUS_ENUM = CAMPAGNES_STATUS_ENUM;

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

  @ViewChild('campagneAction') campagneAction!: ElementRef<HTMLDivElement>;
  @ViewChild('campagneDetails') campagneDetails!: ElementRef<HTMLDivElement>;
  @Input() campagne: Partial<Campagnes> | null = null;

  @Output() emitCampagne = new EventEmitter<void>();

  #resizeObserver: ResizeObserver | undefined;

  ngAfterViewInit(): void {
    this.#resizeObserver = this.#commonUtils.widthListener(
      {
        el: this.#host?.nativeElement,
        classList: ['none'],
        breakpoint: 630,
      },
      (entries, config) => {
        if (!this.campagneAction || !this.campagneAction?.nativeElement) return;
        const entry = entries[0];
        if (!entry) return;
        const hostWidth = entry.contentRect.width;
        const shouldAdd = hostWidth <= config.breakpoint;

        if (shouldAdd) {
          this.#renderer.setStyle(
            this.campagneAction?.nativeElement,
            'display',
            'none'
          );
          this.#renderer.addClass(
            this.campagneDetails?.nativeElement,
            config?.classList[0]
          );
        } else {
          this.#renderer.removeStyle(
            this.campagneAction?.nativeElement,
            'display'
          );
          this.#renderer.removeClass(
            this.campagneDetails?.nativeElement,
            config?.classList[0]
          );
        }
      }
    );
  }

  onEmitCampagne() {
    this.emitCampagne.emit();
  }

  async onHistoryCampagne(e: Event) {
    e.stopPropagation();
    const { EditHistoryComponent } = await import(
      '../edit-history/edit-history.component'
    );
    await this.#router.navigate([], {
      queryParams: { history: this.campagne?.idCampaign },
    });
    const modalRef = this.#ngModal.open(EditHistoryComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'rounded',
    });
  }

  async enableCampagne(e: Event) {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Réactiver la campagne ?',
      html: `Voulez-vous vraiment réactiver la campagne <span style="color: var(--clr-primary); font-weight: 600;">${this.campagne?.name}</span> ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      customClass: {
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
        popup: 'swal-custom-popup',
      },
    });
    if (result.isConfirmed && this.campagne?.idCampaign) {
      this.#campagneService.enableCampagne(this.campagne.idCampaign).subscribe({
        next: (response) => {
          console.log('res enable: ', response);
          this.#campagneService.triggerRefreshCampagnes();
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  async disableCampagne(e: Event) {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Désactiver la campagne ?',
      html: `Voulez-vous vraiment désactiver la campagne <span style="color: var(--clr-primary); font-weight: 600;">${this.campagne?.name}</span> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      customClass: {
        confirmButton: 'swal-custom-cancel',
        cancelButton: 'swal-custom-confirm',
        popup: 'swal-custom-popup',
      },
    });
    if (result.isConfirmed && this.campagne?.idCampaign) {
      this.#campagneService
        .disableCampagne(this.campagne.idCampaign)
        .subscribe({
          next: (response) => {
            console.log('res disable: ', response);
            this.#campagneService.triggerRefreshCampagnes();
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  async closeCampagne(e: Event) {
    e.stopPropagation();
    console.log('campagne: ', this.campagne);

    // Préparer le message HTML avec notification des comptes non certifiés
    let htmlMessage = `<p style="color: var(--clr-dark); font-size: 1rem; font-weight:600;">Voulez-vous vraiment clôturer la campagne <span style="color: var(--clr-primary); font-weight: 600;">${this.campagne?.name}</span> ?</p>`;

    // Ajouter un avertissement si des comptes ne sont pas encore certifiés
    if (
      this.campagne?.notCertifiedAccounts &&
      this.campagne.notCertifiedAccounts > 0
    ) {
      htmlMessage += `
      <div style="display: flex; align-items: center; gap: 0.75rem; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 10px;">
      <div>
        <span>${warningSVG}</span>
        </div> 
        <span style="color: #856404; font-size: 0.875rem;">Cette campagne contient encore <strong>${this.campagne.notCertifiedAccounts}</strong> compte(s) non certifié(s).</span>
      </div>`;
    } else if (
      this.campagne?.certifiedAccounts &&
      this.campagne.certifiedAccounts > 0
    ) {
      // Si tous les comptes sont certifiés, afficher un message de confirmation
      htmlMessage += `
      <div style="display: flex; align-items: center; gap: 0.75rem; background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 10px;">
      <div>
        <span>✅</span>
        </div> 
        <span style="color: #155724; font-size: 0.875rem;">Tous les comptes de cette campagne sont certifiés.</span>
      </div>`;
    }

    const result = await Swal.fire({
      title: 'Clôturer la campagne ?',
      html: htmlMessage,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      customClass: {
        confirmButton: 'swal-custom-cancel',
        cancelButton: 'swal-custom-confirm',
        popup: 'swal-custom-popup',
      },
    });
    if (result.isConfirmed && this.campagne?.idCampaign) {
      this.#campagneService.closeCampagne(this.campagne.idCampaign).subscribe({
        next: (response) => {
          console.log('res cloturer: ', response);
          this.#campagneService.triggerRefreshCampagnes();
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  async planifierCampagne(e: Event) {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Lancer la campagne ?',
      html: `Voulez-vous vraiment lancer la campagne <span style="color: var(--clr-primary); font-weight: 600;">${this.campagne?.name}</span> ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      customClass: {
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
        popup: 'swal-custom-popup',
      },
    });
    if (result.isConfirmed && this.campagne?.idCampaign) {
      this.#campagneService.launchCampagne(this.campagne.idCampaign).subscribe({
        next: (response) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'success',
            title: 'Succès',
            text: 'Campagne lancée avec succès',
          });
          this.#campagneService.triggerRefreshCampagnes();
        },
        error: (error) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors du lancement de la campagne',
          });
        },
      });
    }
  }

  async editCampagne(e: Event) {
    e.stopPropagation();
    if (this.campagne) {
      const modalRef = this.#ngModal.open(UpdateCampagneFormComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowClass: 'rounded',
      });
      modalRef.componentInstance.campagneToUpdate = this.campagne;
    }
  }

  ngOnDestroy(): void {
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
    }
  }
}
