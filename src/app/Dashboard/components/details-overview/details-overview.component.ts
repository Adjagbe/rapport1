import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CampagneInfoCardComponent } from '../campagne-info-cards/campagne-info-cards.component';
import { UsersIconComponent } from 'src/app/Core/icons/users-icon.component';
import { PositiveIconComponent } from 'src/app/Core/icons/positive-icon.component';

import { NegativeIconComponent } from 'src/app/Core/icons/negative-icon.component';
import { UpIconComponent } from 'src/app/Core/icons/up-icon.component';
import { ArrowUpIconComponent } from 'src/app/Core/icons/arrow-up-icon.component';

import { UserErrorIconComponent } from 'src/app/Core/icons/user-error-icon.component';
import { UserEditIconComponent } from 'src/app/Core/icons/user-edit-icon.component';
import { UserWarningIconComponent } from 'src/app/Core/icons/user-warning-icon.component';

import { ContainerCardComponent } from 'src/app/Shared/Components/container-card/container-card.component';
import { StatusCardComponent } from '../status-card/status-card.component';
import { MultiTypeChartComponent } from 'src/app/Shared/Components/multi-type-chart/multi-type-chart.component';
import { DashboardService } from 'src/app/Core/Services/dashboard.service';
import {
  GetCampagneDetailsResponse,
  ExportAccountStatus,
  ChartData,
  ChartConfig,
  ProgressItem,
} from 'src/app/Models/dashboard.model';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import Swal from 'sweetalert2';
import { ExportIconComponent } from 'src/app/Core/icons/export-icon.component';
import { COLORS_LISTS } from 'src/app/Core/Constants/Dashboard.constant';
import { HasPermissionDirective } from "src/app/Core/hasPermission/has-permission.directive";

// Type pour les détails de campagne retournés par le service
type CampagneDetails = GetCampagneDetailsResponse['item'];

function pickRandomColor(colors: string[]): string {
  if (!colors || colors.length === 0) return '#888888';
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

@Component({
  selector: 'details-overview',
  standalone: true,
  imports: [
    CommonModule,
    CampagneInfoCardComponent,
    RouterLink,
    UsersIconComponent,
    PositiveIconComponent,
    NegativeIconComponent,
    UpIconComponent,
    ArrowUpIconComponent,
    UserErrorIconComponent,
    UserEditIconComponent,
    UserWarningIconComponent,
    ContainerCardComponent,
    StatusCardComponent,
    MultiTypeChartComponent,
    BtnGenericComponent,
    ExportIconComponent,
    HasPermissionDirective
],
  templateUrl: './details-overview.component.html',
  styleUrls: ['./details-overview.component.scss'],
})
export class DetailsOverviewComponent implements OnInit {
  #dashboardService = inject(DashboardService);
  #route = inject(ActivatedRoute);

  readonly COLORS_LISTS = COLORS_LISTS;
  campagneName = '';
  campagneDetails: CampagneDetails | null = null;
  filterByGranularity = [
    { label: 'Jour', value: 'day' },
    { label: 'Semaine', value: 'week' },
    { label: 'Mois', value: 'month' },
  ];

  campagneInfoCards:
    | {
        label: string;
        value: number;
        type: 'blue' | 'purple' | 'green' | 'pink' | 'grey';
      }[]
    | null = null;

  // Données pour le graphique donut - Répartition des certifications
  certificationDistribution: ChartData[] = [
    {
      name: 'Certifications',
      data: [
        { name: 'Certifiés', y: 10 },
        { name: 'Non certifiés', y: 5 },
      ],
    },
  ];

  certificationDistributionData: {
    categories: string[];
    series: ChartData[];
  } | null = {
    categories: ['Certifiés', 'Non certifiés'],
    series: [
      {
        name: 'Certifications',
        data: [
          { name: 'Certifiés', y: 10 },
          { name: 'Non certifiés', y: 5 },
        ],
      },
    ],
  };

  donutConfig: ChartConfig = {
    title: '15 Total des comptes',
    colors: ['#28A169', '#FF6B35'],
  };

  // Données pour le graphique line - Evolution de la certification par direction
  evolutionData: {
    categories: string[];
    series: ChartData[];
  } | null = {
    categories: [],
    series: [
      {
        name: 'IT & Digital',
        data: [58, 62, 65, 68, 72, 75, 78, 80, 82, 80, 78, 75],
        color: '#F39C12',
      },
      {
        name: 'Finance',
        data: [60, 64, 68, 72, 76, 78, 80, 82, 84, 82, 80, 78],
        color: '#9B59B6',
      },
      {
        name: 'Marketing',
        data: [80, 78, 75, 72, 68, 65, 62, 58, 55, 52, 50, 48],
        color: '#4A90E2',
      },
      {
        name: 'Operation',
        data: [40, 42, 45, 48, 52, 53, 50, 48, 45, 55, 58, 60],
        color: '#E91E63',
      },
      {
        name: 'Customer Service',
        data: [50, 52, 55, 58, 62, 65, 68, 70, 72, 70, 68, 65],
        color: '#34495E',
      },
    ],
  };

  lineConfig: ChartConfig = {
    xAxis: {
      categories: [
        'Janv',
        'Fev',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Sep',
        'Oct',
        'Nov',
        'Déc',
      ],
    },
    yAxis: {
      title: 'Pourcentage (%)',
      min: 0,
      max: 100,
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },
  };

  // Données pour le graphique barre horizontale - Taux de réponse par direction
  tauxReponseDirection: ChartData[] = [
    {
      name: 'Taux de réponse',
      data: [
        { name: 'IT & Digital', y: 36 },
        { name: 'Finance', y: 76 },
        { name: 'Marketing', y: 35 },
        { name: 'Ressources humaines', y: 43 },
        { name: 'Sécurité', y: 85 },
        { name: 'Administrateur systeme', y: 85 },
      ],
      color: '#E91E63',
    },
  ];

  tauxReponseDirectionData: any = {
    series: [
      {
        name: 'Taux de réponse',
        data: [36, 76, 35, 43, 85, 85],
        color: '#E91E63',
      },
    ],
    categories: [
      'IT & Digital',
      'Finance',
      'Marketing',
      'Ressources humaines',
      'Sécurité',
      'Administrateur systeme',
    ],
  };

  tauxReponseDirectionConfig: ChartConfig = {
    colors: ['#E91E63'],
    legend: {
      enabled: false,
    },
  };

  // Données pour le graphique barre horizontale - Taux de réponse par plateforme
  tauxReponsePlateforme: ChartData[] = [
    {
      name: 'Taux de réponse',
      data: [
        { name: 'Pcam Fusion', y: 36 },
        { name: 'Reversement marchand', y: 76 },
        { name: 'Orange Tracking', y: 35 },
        { name: 'Work auto', y: 43 },
        { name: 'Digigpt', y: 85 },
        { name: 'Digigpt', y: 85 },
      ],
      color: '#9C27B0',
    },
  ];

  tauxReponsePlateformeData: any = {
    series: [
      {
        name: 'Taux de réponse',
        data: [36, 76, 35, 43, 85, 85],
        color: '#9C27B0',
      },
    ],
    categories: [
      'Pcam Fusion',
      'Reversement marchand',
      'Orange Tracking',
      'Work auto',
      'Digigpt',
      'Digigpt',
    ],
  };

  tauxReponsePlateformeConfig: ChartConfig = {
    colors: ['#9C27B0'],
    legend: {
      enabled: false,
    },
  };

  // Nouvelles listes pour les barres de progression
  tauxReponseDirectionList: ProgressItem[] = [];
  tauxReponsePlateformeList: ProgressItem[] = [];

  // Données pour le graphique colonnes empilées - Certification par direction
  certificationDirection: ChartData[] = [
    {
      name: 'Nombre de comptes certifiés',
      data: [450, 320, 280, 380, 420, 350],
      color: '#28A169',
    },
    {
      name: 'Nombre de comptes non certifiés',
      data: [150, 180, 220, 120, 80, 150],
      color: '#FF6B35',
    },
  ];

  certificationDirectionData: any = {
    series: [
      {
        name: 'Nombre de comptes certifiés',
        data: [450, 320, 280, 380, 420, 350],
        color: '#28A169',
      },
      {
        name: 'Nombre de comptes non certifiés',
        data: [150, 180, 220, 120, 80, 150],
        color: '#FF6B35',
      },
    ],
    categories: [
      'PCAM',
      'Rapportage',
      'Suivi Orange',
      'Travail automatique',
      'Reversement marchand',
      'Digi Budget',
    ],
  };

  certificationDirectionConfig: ChartConfig = {
    xAxis: {
      categories: [],
    },
    yAxis: {
      min: 0,
      max: 900,
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },
  };

  // Données pour le graphique colonnes empilées - Certification par plateforme
  certificationPlateforme: ChartData[] = [];
  certificationPlateformeData: any = {
    series: [],
    categories: [],
  };

  certificationPlateformeConfig: ChartConfig = {
    xAxis: {
      categories: [],
    },
    yAxis: {
      min: 0,
      max: 900,
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },
  };

  ngOnInit(): void {
    this.getheading();
    this.getCampagneDetails();
    this.getevolutionCertification();
  }

  getheading() {
    this.campagneName =
      this.#route.snapshot.paramMap.get('campagneName')?.split('-').join(' ') ??
      '';
  }

  getCampagneDetails() {
    const campagneId = this.#route.snapshot.queryParamMap.get('id');

    if (campagneId) {
      this.#dashboardService.getDetails(+campagneId).subscribe({
        next: (response) => {
          console.log('[DetailsOverviewComponent]: ', response);
          this.campagneInfoCards = [
            {
              label: 'Total des comptes utilisateur',
              value: response?.totalAccounts ?? 0,
              type: 'purple',
            },
            {
              label: 'Comptes Certifiés',
              value: response?.certifiedAccounts ?? 0,
              type: 'green',
            },
            {
              label: 'Comptes non certifiés',
              value: response?.notCertifiedAccounts ?? 0,
              type: 'pink',
            },
            {
              label: 'Taux réponse',
              value: Math.round(response?.advancementRate ?? 0),
              type: 'grey',
            },
          ];
          this.campagneDetails = response ?? null;
          this.tauxReponseDirection = this.buildTauxReponseDirection(
            response?.responseRateByDepartment ?? {}
          );

          this.tauxReponsePlateforme = this.buildTauxReponsePlateforme(
            response?.responseRateByApplication ?? {}
          );

          this.certificationDirectionData = this.buildCertificationDirection(
            response?.statusByDepartment ?? {}
          );
          this.certificationPlateforme = this.buildCertificationPlateforme(
            response?.statusByApplication ?? {}
          );
          this.certificationDistributionData =
            this.buildCertificationDistributionData(response);
          console.log(
            '[getCampagneDetails] certificationDistributionData assigned:',
            this.certificationDistributionData
          );
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  buildCertificationDistributionData(payload: any) {
    console.log('REEE: ', payload);
    return {
      categories: ['Certifiés', 'Non certifiés'],
      series: [
        {
          name: 'Certifications',
          data: [
            {
              name: 'Certifiés',
              y: payload?.percentFullyCertifiedApplications,
            },
            {
              name: 'Non certifiés',
              y: payload?.percentNonCertifiedApplications,
            },
          ],
        },
      ],
    };
  }

  buildTauxReponseDirection(
    responseRateByDepartment: GetCampagneDetailsResponse['item']['responseRateByDepartment']
  ): ChartData[] {
    if (
      !responseRateByDepartment ||
      Object.keys(responseRateByDepartment).length === 0
    )
      return [];

    const entries = Object.entries(responseRateByDepartment);
    const categories = entries.map(([direction]) => direction);
    const rates = entries.map(([direction, rate]) => Math.round(rate));

    // Créer les données pour le nouveau composant
    this.tauxReponseDirectionData = {
      series: [
        {
          name: '',
          data: rates,
          color: '#E91E63',
          showInLegend: false,
        },
      ],
      categories: categories,
    };

    // Renseigner la liste de barres de progression
    this.tauxReponseDirectionList = entries.map(([direction, rate]) => ({
      label: direction,
      value: Math.round(rate as number),
      color: pickRandomColor(this.COLORS_LISTS),
    }));

    const data = entries.map(([direction, rate]) => ({
      name: direction,
      y: Math.round(rate),
    }));

    return [
      {
        name: '',
        data: data,
        color: '#E91E63',
        showInLegend: false,
      },
    ];
  }

  buildTauxReponsePlateforme(
    responseRateByApplication: GetCampagneDetailsResponse['item']['responseRateByApplication']
  ): ChartData[] {
    if (
      !responseRateByApplication ||
      Object.keys(responseRateByApplication).length === 0
    )
      return [];

    const entries = Object.entries(responseRateByApplication);
    const categories = entries.map(([application]) => application);
    const rates = entries.map(([application, rate]) => Math.round(rate));

    // Créer les données pour le nouveau composant
    this.tauxReponsePlateformeData = {
      series: [
        {
          name: '',
          data: rates,
          color: '#9C27B0',
          showInLegend: false,
        },
      ],
      categories: categories,
    };

    // Renseigner la liste de barres de progression
    this.tauxReponsePlateformeList = entries.map(([application, rate]) => ({
      label: application,
      value: Math.round(rate as number),
      color: pickRandomColor(this.COLORS_LISTS),
    }));

    const data = entries.map(([application, rate]) => ({
      name: application,
      y: Math.round(rate),
    }));

    return [
      {
        name: '',
        data: data,
        color: '#9C27B0',
        showInLegend: false,
      },
    ];
  }

  buildCertificationDirection(
    statusByDepartment: GetCampagneDetailsResponse['item']['statusByDepartment']
  ): { series: ChartData[]; categories: string[] } {
    if (!statusByDepartment || Object.keys(statusByDepartment).length === 0)
      return { series: [], categories: [] };

    const entries = Object.entries(statusByDepartment);
    const categories = entries.map(([direction, status]) => direction);

    const series: ChartData[] = [
      {
        name: 'Nombre de comptes certifiés',
        data: entries.map(([direction, status]) => status.certified),
        color: '#50BE87',
      },
      {
        name: 'Nombre de comptes non certifiés',
        data: entries.map(([direction, status]) => status.pending),
        color: '#FAB900',
      },
    ];

    // Mettre à jour les catégories de l'axe X avec les noms des directions
    if (this.certificationDirectionConfig.xAxis) {
      this.certificationDirectionConfig.xAxis.categories = categories;
    }

    console.log('[buildCertificationDirection] series:', {
      categories,
      series,
    });

    return { series, categories };
  }

  buildCertificationPlateforme(
    statusByApplication: GetCampagneDetailsResponse['item']['statusByApplication']
  ): ChartData[] {
    console.log(
      '[buildCertificationPlateforme] Input data:',
      statusByApplication
    );

    if (!statusByApplication || Object.keys(statusByApplication).length === 0) {
      console.log('[buildCertificationPlateforme] No data or empty object');
      return [];
    }

    const entries = Object.entries(statusByApplication);
    console.log('[buildCertificationPlateforme] Entries:', entries);

    const categories = entries.map(([application]) => application);

    // Créer les données pour le nouveau composant
    this.certificationPlateformeData = {
      series: [
        {
          name: 'Nombre de comptes certifiés',
          data: entries.map(([application, status]) => status.certified),
          color: '#50BE87',
        },
        {
          name: 'Nombre de comptes non certifiés',
          data: entries.map(([application, status]) => status.pending),
          color: '#4BB4E6',
        },
      ],
      categories: categories,
    };

    console.log(
      '[buildCertificationPlateforme] New data format:',
      this.certificationPlateformeData
    );

    // Garder l'ancien format pour compatibilité
    if (this.certificationPlateformeConfig.xAxis) {
      this.certificationPlateformeConfig.xAxis.categories = categories;
      console.log(
        '[buildCertificationPlateforme] Updated categories:',
        this.certificationPlateformeConfig.xAxis.categories
      );
    }

    const certifiedData = entries.map(([application, status]) => ({
      name: application,
      y: status.certified,
    }));

    const pendingData = entries.map(([application, status]) => ({
      name: application,
      y: status.pending,
    }));

    const result = [
      {
        name: 'Nombre de comptes certifiés',
        data: certifiedData,
        color: '#28A169',
      },
      {
        name: 'Nombre de comptes non certifiés',
        data: pendingData,
        color: '#4A90E2',
      },
    ];

    console.log('[buildCertificationPlateforme] Final result:', result);
    return result;
  }

  // Fonction utilitaire pour transformer l'evolutionData de l'API en données de graphique
  private mapEvolutionDataForChart(evolutionData: Record<string, any[]>): {
    series: ChartData[];
    categories: string[];
  } {
    if (!evolutionData) return { series: [], categories: [] };

    // 1. Prendre les dates dans l'ordre d'arrivée (pas de tri)
    const dates = Object.keys(evolutionData);

    // 2. Récupérer tous les groupName uniques dans l'ordre de première apparition
    const groupNames: string[] = [];
    dates.forEach((date) => {
      (evolutionData[date] || []).forEach((item) => {
        if (!groupNames.includes(item.groupName)) {
          groupNames.push(item.groupName);
        }
      });
    });

    // 3. Pour chaque groupName, construire la série de certifiedAccounts par date (somme si plusieurs fois le même groupName pour une date)
    const palette = [
      '#F39C12',
      '#9B59B6',
      '#4A90E2',
      '#E91E63',
      '#34495E',
      '#28A169',
      '#FF6B35',
      '#9C27B0',
    ];
    const series: ChartData[] = groupNames.map((groupName, idx) => ({
      name: groupName,
      data: dates.map((date) => {
        const items = (evolutionData[date] || []).filter(
          (item) => item.groupName === groupName
        );
        // Additionner les certifiedAccounts si plusieurs fois le même groupName pour une date
        return items.reduce(
          (sum, item) => sum + (item.certifiedAccounts || 0),
          0
        );
      }),
      color: palette[idx % palette.length],
    }));

    // 4. Mettre à jour la config de l'axe X avec les dates telles quelles
    if (this.lineConfig.xAxis) {
      this.lineConfig.xAxis.categories = dates;
    }

    return { series, categories: dates };
  }

  granularity: 'day' | 'week' | 'month' | 'year' = 'day';
  onFilterChange(value: 'day' | 'week' | 'month' | 'year') {
    this.granularity = value;
    this.getevolutionCertification();
  }

  getevolutionCertification() {
    const campagneId = this.#route.snapshot.queryParamMap.get('id');

    if (campagneId) {
      this.#dashboardService
        .evolutionCertification(+campagneId, this.granularity)
        .subscribe({
          next: (response) => {
            console.log('[getevolutionCertification] Response:', response);
            if (response?.evolutionData) {
              this.evolutionData = this.mapEvolutionDataForChart(
                response.evolutionData
              );
              // this.evolutionData = series;
              // if (this.lineConfig.xAxis) {
              //   this.lineConfig.xAxis.categories = categories;
              // }
              console.log(
                '[getevolutionCertification] evolutionData:',
                this.evolutionData
              );
            } else {
              this.evolutionData = null;
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  exportReport(exportAccountStatus: ExportAccountStatus) {
    const campagneId = this.#route.snapshot.queryParamMap.get('id');
    const exportableCount = this.#getExportableCount(exportAccountStatus);

    // Si rien à exporter, on ne lance pas la requête et on affiche un message
    if (!exportableCount) {
      Swal.fire({
        toast: true,
        icon: 'info',
        title: 'Aucune donnée à exporter pour ce statut',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    if (campagneId) {
      this.#dashboardService
        .exportReportByStatus(+campagneId, exportAccountStatus)
        .subscribe({
          next: (blob) => {
            console.log(
              '[exportReport] Export successful for status:',
              exportAccountStatus
            );
          },
          error: (error) => {
            console.error('[exportReport] Export failed:', error);
          },
        });
    }
  }

  #getExportableCount(exportAccountStatus: ExportAccountStatus): number {
    const d = this.campagneDetails;
    switch (exportAccountStatus) {
      case 'MOVED_DEPARTMENT':
        return d?.mobilityAccounts ?? 0;
      case 'TO_DEACTIVATE':
        return d?.toDeactivateAccounts ?? 0;
      case 'PROFILE_CHANGE_NEEDED':
        return d?.profileChangeNeededAccounts ?? 0;
      case 'PENDING':
        // Propriété donnée par le besoin
        return (d as any)?.ihaveNotIdea ?? 0;
      default:
        return 0;
    }
  }
}
