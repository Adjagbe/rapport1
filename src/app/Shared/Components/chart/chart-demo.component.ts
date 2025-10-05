import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ChartType,
  ChartData,
  ChartConfig,
} from './chart.component';
import { ContainerCardComponent } from '../container-card/container-card.component';

@Component({
  selector: 'app-chart-demo',
  standalone: true,
  imports: [CommonModule, ChartComponent, ContainerCardComponent],
  template: `
    <div class="demo-container">
      <h1>Démonstration des Graphiques</h1>
      <p>Exemples d'utilisation du composant graphique réutilisable</p>

      <!-- Section 1: Graphiques de répartition -->
      <div class="section">
        <h2>Répartition des données</h2>
        <div class="charts-row">
          <container-card
            title="Répartition des certifications"
            description="Graphique en anneau montrant la répartition"
          >
            <ng-container icon>
              <div class="chart-icon">📊</div>
            </ng-container>
            <ng-container>
              <app-chart
                [chartType]="'donut'"
                [chartData]="certificationDistribution"
                [config]="donutConfig"
                height="250px"
              ></app-chart>
            </ng-container>
          </container-card>

          <container-card
            title="Répartition par plateforme"
            description="Graphique circulaire simple"
          >
            <ng-container icon>
              <div class="chart-icon">🖥️</div>
            </ng-container>
            <ng-container>
              <app-chart
                [chartType]="'pie'"
                [chartData]="platformDistribution"
                [config]="pieConfig"
                height="250px"
              ></app-chart>
            </ng-container>
          </container-card>
        </div>
      </div>

      <!-- Section 2: Graphiques temporels -->
      <div class="section">
        <h2>Évolution temporelle</h2>
        <container-card
          title="Evolution de la certification par direction"
          description="Graphique en ligne sur 12 mois"
        >
          <ng-container icon>
            <div class="chart-icon">📈</div>
          </ng-container>
          <ng-container>
            <app-chart
              [chartType]="'line'"
              [chartData]="evolutionData"
              [config]="lineConfig"
              height="350px"
            ></app-chart>
          </ng-container>
        </container-card>
      </div>

      <!-- Section 3: Graphiques de comparaison -->
      <div class="section">
        <h2>Comparaisons</h2>
        <div class="charts-row">
          <container-card
            title="Taux de réponse par direction"
            description="Graphique en barres horizontales"
          >
            <ng-container icon>
              <div class="chart-icon">📊</div>
            </ng-container>
            <ng-container>
              <app-chart
                [chartType]="'bar'"
                [chartData]="responseRateDirection"
                [config]="barConfig"
                height="300px"
              ></app-chart>
            </ng-container>
          </container-card>

          <container-card
            title="Taux de réponse par plateforme"
            description="Graphique en barres avec couleurs personnalisées"
          >
            <ng-container icon>
              <div class="chart-icon">🖥️</div>
            </ng-container>
            <ng-container>
              <app-chart
                [chartType]="'bar'"
                [chartData]="responseRatePlatform"
                [config]="barConfigPlatform"
                height="300px"
              ></app-chart>
            </ng-container>
          </container-card>
        </div>
      </div>

      <!-- Section 4: Graphiques empilés -->
      <div class="section">
        <h2>Données empilées</h2>
        <div class="charts-row">
          <container-card
            title="Certification par direction"
            description="Graphique en colonnes empilées"
          >
            <ng-container icon>
              <div class="chart-icon">📊</div>
            </ng-container>
            <ng-container>
              <app-chart
                [chartType]="'stacked-column'"
                [chartData]="certificationByDirection"
                [config]="stackedColumnConfig"
                height="350px"
              ></app-chart>
            </ng-container>
          </container-card>

          <container-card
            title="Certification par plateforme"
            description="Graphique en colonnes empilées"
          >
            <ng-container icon>
              <div class="chart-icon">🖥️</div>
            </ng-container>
            <ng-container>
              <app-chart
                [chartType]="'stacked-column'"
                [chartData]="certificationByPlatform"
                [config]="stackedColumnConfig"
                height="350px"
              ></app-chart>
            </ng-container>
          </container-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .demo-container h1 {
        color: #333;
        margin-bottom: 8px;
        font-size: 28px;
        font-weight: 700;
      }

      .demo-container > p {
        color: #666;
        margin-bottom: 32px;
        font-size: 16px;
      }

      .section {
        margin-bottom: 48px;
      }

      .section h2 {
        color: #333;
        margin-bottom: 24px;
        font-size: 22px;
        font-weight: 600;
        border-bottom: 2px solid #28a169;
        padding-bottom: 8px;
      }

      .charts-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 24px;
      }

      .chart-icon {
        font-size: 24px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        border-radius: 8px;
      }

      @media (max-width: 768px) {
        .demo-container {
          padding: 16px;
        }

        .charts-row {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .demo-container h1 {
          font-size: 24px;
        }

        .section h2 {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class ChartDemoComponent {
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

  // Données pour le graphique pie - Répartition par plateforme
  platformDistribution: ChartData[] = [
    {
      name: 'Plateformes',
      data: [
        { name: 'PCAM', y: 25 },
        { name: 'Reporting', y: 20 },
        { name: 'Orange Tracking', y: 15 },
        { name: 'Work Auto', y: 18 },
        { name: 'Reversement', y: 12 },
        { name: 'Digi Budget', y: 10 },
      ],
    },
  ];

  pieConfig: ChartConfig = {
    title: 'Répartition par plateforme',
    colors: ['#28A169', '#4A90E2', '#F39C12', '#9B59B6', '#E74C3C', '#1ABC9C'],
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

  barConfigPlatform: ChartConfig = {
    xAxis: {
      categories: [
        'Pcam Fusion',
        'Reversement marchand',
        'Orange Tracking',
        'Work auto',
        'Digigpt',
        'Digigpt',
      ],
      title: 'Plateformes',
    },
    yAxis: {
      title: 'Pourcentage (%)',
      min: 0,
      max: 100,
    },
  };

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
