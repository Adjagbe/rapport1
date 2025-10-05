import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, Subscription, switchMap, tap } from 'rxjs';
import { CertificationService } from 'src/app/Core/Services/certification.service';
import { CertificationDetailsItem } from 'src/app/Models/certification.model';
import { TruncatePipe } from 'src/app/Shared/Pipes/truncate.pipe';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { ValidIconComponent } from 'src/app/Core/icons/valid-icon.component';
import { CloseIconBtnComponent } from 'src/app/Core/icons/close-btn-icon.component';

@Component({
  selector: 'app-certified-user-details',
  standalone: true,
  imports: [
    CommonModule,
    ModalLayoutComponent,
    TruncatePipe,
    BtnGenericComponent,
    ValidIconComponent,
    CloseIconBtnComponent,
  ],
  templateUrl: './certified-user-details.component.html',
  styleUrls: ['./certified-user-details.component.scss'],
})
export class CertifiedUserDetailsComponent implements OnInit, OnDestroy {
  #activeModal = inject(NgbActiveModal);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #certificationService = inject(CertificationService);

  details: CertificationDetailsItem | null = null;
  detailsQuery$ = this.#route.queryParamMap.pipe(
    map((param) => param.get('details')),
    switchMap((id) => {
      if (id) {
        return this.#certificationService.getCertificationDetails(id);
      }
      return of(null);
    }),
    tap((maybeDetails) => (this.details = maybeDetails))
  );
  detailsQuerySub!: Subscription;

  // Tooltip properties
  isTooltipVisible = false;
  tooltipText = '';
  tooltipPosition = { x: 0, y: 0 };

  ngOnInit(): void {
    this.detailsQuerySub = this.detailsQuery$.subscribe();
  }

  get fullName() {
    if (
      this.details?.userAccountLastName &&
      this.details?.userAccountFirstName
    ) {
      return `${this.details?.userAccountLastName} ${this.details?.userAccountFirstName}`;
    }
    return '---';
  }

  get certifierName() {
    if (this.details?.certifierLastName && this.details?.certifierFirstName) {
      return `${this.details?.certifierLastName} ${this.details?.certifierFirstName}`;
    }
    return '---';
  }

  close() {
    this.#activeModal.close();
  }

  trackByQuestionId(index: number, response: any): number {
    return response.questionId;
  }

  // Tooltip methods
  showTooltip(event: MouseEvent, text: string): void {
    this.tooltipText = text;
    this.tooltipPosition = {
      x: event.clientX - 20,
      y: event.clientY - 10,
    };
    this.isTooltipVisible = true;
  }

  hideTooltip(): void {
    this.isTooltipVisible = false;
  }

  ngOnDestroy(): void {
    this.detailsQuerySub?.unsubscribe();
    this.#router.navigate([], {
      queryParams: {
        details: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
