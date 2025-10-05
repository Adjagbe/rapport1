import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalLayoutComponent } from 'src/app/Core/layouts/modal-layout/modal-layout.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionCampagnesService } from 'src/app/Core/Services/gestion-campagnes.service';
import {
  EditCampagneHistoryItem,
  EditCampagneHistoryModification,
  AuditModifTypeEnum,
} from 'src/app/Models/gestion-campagnes.model';
import { LoaderService } from 'src/app/Core/Services/loader.service';
import {
  EditCampagneHistoryItemWithDates,
  EditCampagneHistoryModificationWithDates,
} from 'src/app/Models/edit-history.model';
import {
  CalendarIconComponent,
  UserIconComponent,
  ArrowIconComponent,
} from 'src/app/Core/icons';
import { TITLE_TO_DISPLAY } from 'src/app/Core/Constants/edit-history.constant';

@Component({
  selector: 'app-edit-history',
  standalone: true,
  imports: [
    CommonModule,
    ModalLayoutComponent,
    CalendarIconComponent,
    UserIconComponent,
    ArrowIconComponent,
  ],
  templateUrl: './edit-history.component.html',
  styleUrls: ['./edit-history.component.scss'],
})
export class EditHistoryComponent implements OnInit, OnDestroy {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #campagneService = inject(GestionCampagnesService);
  loaderService = inject(LoaderService);

  readonly TITLE_TO_DISPLAY = TITLE_TO_DISPLAY;

  idCampagne: number | null = null;
  historysList: Array<EditCampagneHistoryItemWithDates> | null = null;

  ngOnInit(): void {
    this.idCampagne = +(
      this.#route.snapshot.queryParamMap.get('history') ?? '0'
    );
    this.getCampagneEditHistory();
  }

  getLabel(modifType: string | undefined): string {
    switch (modifType) {
      case AuditModifTypeEnum.END_DATE:
        return 'Date de fin';
      case AuditModifTypeEnum.START_DATE:
        return 'Date de début';
      case AuditModifTypeEnum.ADD_ACCOUNT:
        return 'Ajout de compte';
      case AuditModifTypeEnum.REPLACE_ACCOUNT:
        return 'Remplacement de compte';
      case AuditModifTypeEnum.DEPARTMENT:
        return 'Département';
      case AuditModifTypeEnum.NAME:
        return 'Nom de la campagne';
      case AuditModifTypeEnum.DELETE_APP:
        return "Suppression d'application";
      default:
        return 'Modification';
    }
  }

  /**
   * Convertit une chaîne de date au format français "dd/MM/yyyy HH:mm" en objet Date
   */
  private parseFrenchDate(dateString: string): Date | null {
    if (!dateString) return null;

    // Format attendu: "dd/MM/yyyy HH:mm" (ex: "22/08/2025 17:54")
    const match = dateString.match(
      /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/
    );
    if (!match) return null;

    const [, day, month, year, hour, minute] = match;
    // month - 1 car les mois en JavaScript commencent à 0
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
  }

  getCampagneEditHistory() {
    if (this.idCampagne) {
      this.#campagneService.getCampagneEditHistory(this.idCampagne).subscribe({
        next: (editCampagneHistorys) => {
          this.historysList =
            editCampagneHistorys?.map((history) => {
              const { modifications } = history;
              const newModifications: EditCampagneHistoryModificationWithDates[] =
                modifications.map((m) => ({
                  ...m,
                  modifLable: this.getLabel(m.modifType),
                  // Convertir les valeurs de date en objets Date
                  oldValue:
                    this.parseFrenchDate(m.oldValue || '') || m.oldValue,
                  newValue:
                    this.parseFrenchDate(m.newValue || '') || m.newValue,
                }));
              return {
                ...history,
                title: history.legendeType
                  ? TITLE_TO_DISPLAY[
                      history.legendeType as keyof typeof TITLE_TO_DISPLAY
                    ]
                  : null,
                // Convertir createdAt en objet Date
                createdAt:
                  this.parseFrenchDate(history.createdAt) || history.createdAt,
                modifications: newModifications,
              };
            }) ?? null;
        },
        error: (error) => {},
      });
    }
  }

  hasValidMods(
    history: EditCampagneHistoryItemWithDates | null | undefined
  ): boolean {
    if (!history || !Array.isArray(history.modifications)) {
      return false;
    }
    return history.modifications.some(
      (m) =>
        (Boolean(m.oldValue) && Boolean(m.newValue)) || Boolean(m.modifValue)
    );
  }

  async clearHistory() {
    await this.#router.navigate([], {
      queryParams: { history: null },
    });
  }

  ngOnDestroy(): void {
    this.clearHistory();
  }
}
