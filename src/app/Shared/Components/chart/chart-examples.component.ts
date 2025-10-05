import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ChartType,
  ChartData,
  ChartConfig,
} from './chart.component';

@Component({
  selector: 'app-chart-examples',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  template: `
    <div class="charts-grid">
      <!-- Graphique Donut - Répartition des certifications -->
      <div class="chart-item">
        <h3>Répartition des certifications</h3>
        <app-chart
          [chartType]="'donut'"
          [chartData]="certificationDistribution"
          [config]="donutConfig"
          height="300px"
        ></app-chart>
      </div>

      <!-- Graphique Line - Evolution de la certification par direction -->
      <div class="chart-item">
        <h3>Evolution de la certification par direction</h3>
        <app-chart
          [chartType]="'line'"
          [chartData]="evolutionData"
          [config]="lineConfig"
          height="300px"
        ></app-chart>
      </div>

      <!-- Graphique Bar - Taux de réponse par direction -->
      <div class="chart-item">
        <h3>Taux de réponse par direction</h3>
        <app-chart
          [chartType]="'bar'"
          [chartData]="responseRateDirection"
          [config]="barConfig"
          height="300px"
        ></app-chart>
      </div>

      <!-- Graphique Bar - Taux de réponse par plateforme -->
      <div class="chart-item">
        <h3>Taux de réponse par plateforme</h3>
        <app-chart
          [chartType]="'bar'"
          [chartData]="responseRatePlatform"
          [config]="barConfig"
          height="300px"
        ></app-chart>
      </div>

      <!-- Graphique Stacked Column - Certification par direction -->
      <div class="chart-item">
        <h3>Certification par direction</h3>
        <app-chart
          [chartType]="'stacked-column'"
          [chartData]="certificationByDirection"
          [config]="stackedColumnConfig"
          height="300px"
        ></app-chart>
      </div>

      <!-- Graphique Stacked Column - Certification par plateforme -->
      <div class="chart-item">
        <h3>Certification par plateforme</h3>
        <app-chart
          [chartType]="'stacked-column'"
          [chartData]="certificationByPlatform"
          [config]="stackedColumnConfig"
          height="300px"
        ></app-chart>
      </div>
    </div>
  `,
  styles: [
    `
      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
        padding: 20px;
      }

      .chart-item {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .chart-item h3 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      @media (max-width: 768px) {
        .charts-grid {
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 16px;
        }
      }
    `,
  ],
})
export class ChartExamplesComponent {
  // Données pour le graphique donut - Répartition des certifications
  certificationDistribution: ChartData[] = [
    {
      name: 'Certifications',
      data: [
        { name: 'Certifiés', y: 70 },
        { name: 'Non certifiés', y: 30 },
      ],
    },
  ];

  donutConfig: ChartConfig = {
    title: '24 Total des applications',
    colors: ['#28A169', '#FF6B35'],
  };

  // Données pour le graphique line - Evolution de la certification par direction
  evolutionData: ChartData[] = [
    {
      name: 'IT & Digital',
      data: [20, 35, 45, 60, 75, 85, 80, 70, 65, 60, 55, 50],
      color: '#F39C12',
    },
    {
      name: 'Finance',
      data: [15, 25, 40, 55, 70, 80, 85, 90, 85, 80, 75, 70],
      color: '#9B59B6',
    },
    {
      name: 'Marketing',
      data: [10, 20, 30, 45, 60, 70, 75, 70, 65, 60, 55, 50],
      color: '#4A90E2',
    },
    {
      name: 'Operation',
      data: [25, 35, 50, 65, 80, 90, 85, 80, 75, 70, 65, 60],
      color: '#E91E63',
    },
    {
      name: 'Customer Service',
      data: [30, 40, 55, 70, 85, 95, 90, 85, 80, 75, 70, 65],
      color: '#34495E',
    },
  ];

  lineConfig: ChartConfig = {
    xAxis: {
      categories: [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Août',
        'Sep',
        'Oct',
        'Nov',
        'Déc',
      ],
      title: 'Mois',
    },
    yAxis: {
      title: 'Pourcentage (%)',
      min: 0,
      max: 100,
    },
  };

  // Données pour le graphique bar - Taux de réponse par direction
  responseRateDirection: ChartData[] = [
    {
      name: 'Taux de réponse',
      data: [36, 76, 35, 43, 85, 85],
      color: '#E91E63',
    },
  ];

  barConfig: ChartConfig = {
    xAxis: {
      categories: [
        'IT & Digital',
        'Finance',
        'Marketing',
        'Ressources humaines',
        'Sécurité',
        'Administrateur système',
      ],
      title: 'Directions',
    },
    yAxis: {
      title: 'Pourcentage (%)',
      min: 0,
      max: 100,
    },
  };

  // Données pour le graphique bar - Taux de réponse par plateforme
  responseRatePlatform: ChartData[] = [
    {
      name: 'Taux de réponse',
      data: [36, 76, 35, 43, 85, 85],
      color: '#9B59B6',
    },
  ];

  // Données pour le graphique stacked column - Certification par direction
  certificationByDirection: ChartData[] = [
    {
      name: 'Nombre de comptes certifiés',
      data: [600, 450, 300, 350, 800, 700],
      color: '#28A169',
    },
    {
      name: 'Nombre de comptes non certifiés',
      data: [200, 150, 100, 200, 100, 150],
      color: '#FF6B35',
    },
  ];

  stackedColumnConfig: ChartConfig = {
    xAxis: {
      categories: [
        'PCAM',
        'Rapportage',
        'Suivi Orange',
        'Travail automatique',
        'Reversement marchand',
        'Digi Budget',
      ],
      title: 'Directions',
    },
    yAxis: {
      title: 'Nombre de comptes',
      min: 0,
      max: 900,
    },
  };

  // Données pour le graphique stacked column - Certification par plateforme
  certificationByPlatform: ChartData[] = [
    {
      name: 'Nombre de compte certifié',
      data: [550, 400, 250, 300, 750, 650],
      color: '#4A90E2',
    },
    {
      name: 'Nombre de compte non certifié',
      data: [150, 100, 50, 150, 50, 100],
      color: '#34495E',
    },
  ];
}
