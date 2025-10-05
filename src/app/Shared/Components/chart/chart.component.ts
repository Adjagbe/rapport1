import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';

export type ChartType =
  | 'line'
  | 'column'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'area'
  | 'stacked-column'
  | 'stacked-bar';

export interface ChartData {
  name: string;
  data: number[] | { name: string; y: number }[];
  color?: string;
}

export interface ChartConfig {
  title?: string;
  subtitle?: string;
  xAxis?: {
    categories?: string[];
    title?: string;
  };
  yAxis?: {
    title?: string;
    min?: number;
    max?: number;
  };
  colors?: string[];
  legend?: {
    enabled?: boolean;
    layout?: 'horizontal' | 'vertical';
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
  };
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div #chartContainer class="chart-wrapper"></div>
    </div>
  `,
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @Input() chartType: ChartType = 'line';
  @Input() chartData: ChartData[] = [];
  @Input() config: ChartConfig = {};
  @Input() height: string = '400px';
  @Input() width: string = '100%';

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  private chart: Highcharts.Chart | undefined;

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Détecter les changements dans chartData ou config
    if (changes['chartData'] || changes['config']) {
      console.log('[ChartComponent] Data changed, updating chart:', changes);

      if (this.chart) {
        // Si le graphique existe déjà, le mettre à jour
        this.updateChartData();
      } else if (this.chartContainer) {
        // Si le graphique n'existe pas encore mais que le container est prêt, le créer
        console.log('[ChartComponent] Chart not created yet, creating it now');
        this.createChart();
      }
      // Si ni le graphique ni le container ne sont prêts, on attend ngAfterViewInit
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Ne créer le graphique que s'il n'y a pas déjà de données
      if (this.chartData.length === 0) {
        console.log('[ChartComponent] No data yet, creating empty chart');
        this.createChart();
      } else {
        console.log(
          '[ChartComponent] Data already available, creating chart with data'
        );
        this.createChart();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    if (!this.chartContainer) return;

    console.log('[ChartComponent] Creating chart with data:', this.chartData);
    console.log('[ChartComponent] Chart config:', this.config);
    console.log('[ChartComponent] Chart type:', this.chartType);

    const options = this.getChartOptions();
    console.log('[ChartComponent] Chart options:', options);

    try {
      this.chart = Highcharts.chart(this.chartContainer.nativeElement, options);
      console.log('[ChartComponent] Chart created successfully');

      // Vérifier si le graphique est bien rendu
      setTimeout(() => {
        const svgElement =
          this.chartContainer.nativeElement.querySelector('svg');
        const highchartsContainer =
          this.chartContainer.nativeElement.querySelector(
            '.highcharts-container'
          );
        console.log('[ChartComponent] SVG element found:', !!svgElement);
        console.log(
          '[ChartComponent] Highcharts container found:',
          !!highchartsContainer
        );
        console.log('[ChartComponent] Chart container dimensions:', {
          width: this.chartContainer.nativeElement.offsetWidth,
          height: this.chartContainer.nativeElement.offsetHeight,
        });
      }, 100);
    } catch (error) {
      console.error('Erreur lors de la création du graphique:', error);
    }
  }

  private getChartOptions(): Highcharts.Options {
    const baseOptions: Highcharts.Options = {
      chart: {
        type: this.getChartType(),

        width: this.width === '100%' ? undefined : parseInt(this.width),
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Roboto, sans-serif',
        },
      },
      title: {
        text: this.config.title || '',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
        },
      },
      subtitle: {
        text: this.config.subtitle || '',
        style: {
          fontSize: '14px',
          color: '#666',
        },
      },
      xAxis: {
        categories: this.config.xAxis?.categories || [],
        title: {
          text: this.config.xAxis?.title || '',
          style: {
            fontSize: '12px',
            color: '#666',
          },
        },
        labels: {
          style: {
            fontSize: '10px',
            color: '#666',
          },
          rotation: 0,
          align: 'left',
          y: 20,
        },
      },
      yAxis: {
        title: {
          text: this.config.yAxis?.title || '',
          style: {
            fontSize: '12px',
            color: '#666',
          },
        },
        min: this.config.yAxis?.min,
        max: this.config.yAxis?.max,
        labels: {
          style: {
            fontSize: '11px',
            color: '#666',
          },
        },
      },
      colors: this.config.colors || this.getDefaultColors(),
      legend: {
        enabled: this.config.legend?.enabled !== false,
        layout: this.config.legend?.layout || 'horizontal',
        align: this.config.legend?.align || 'center',
        verticalAlign: this.config.legend?.verticalAlign || 'bottom',
        itemStyle: {
          fontSize: '11px',
          color: '#666',
        },
      },
      credits: {
        enabled: false,
      },
      plotOptions: this.getPlotOptions(),
      series: this.getSeriesData(),
    };

    return baseOptions;
  }

  private getChartType(): string {
    switch (this.chartType) {
      case 'donut':
        return 'pie';
      case 'stacked-column':
        return 'column';
      case 'stacked-bar':
        return 'bar';
      case 'line':
        return 'line'; // Utilise line pour des lignes continues
      default:
        return this.chartType;
    }
  }

  private getDefaultColors(): string[] {
    return [
      '#28A169', // Vert
      '#FF6B35', // Orange
      '#4A90E2', // Bleu
      '#9B59B6', // Violet
      '#E74C3C', // Rouge
      '#F39C12', // Jaune
      '#1ABC9C', // Turquoise
      '#34495E', // Gris foncé
    ];
  }

  private getPlotOptions(): any {
    const plotOptions: any = {};

    switch (this.chartType) {
      case 'pie':
      case 'donut':
        plotOptions.pie = {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%',
            style: {
              fontSize: '11px',
            },
          },
          showInLegend: true,
        };
        if (this.chartType === 'donut') {
          plotOptions.pie.innerSize = '60%';
        }
        break;

      case 'column':
      case 'stacked-column':
        plotOptions.column = {
          dataLabels: {
            enabled: false,
          },
        };
        if (this.chartType === 'stacked-column') {
          plotOptions.column.stacking = 'normal';
        }
        break;

      case 'bar':
      case 'stacked-bar':
        plotOptions.bar = {
          dataLabels: {
            enabled: false,
          },
          borderRadius: 8,
          pointPadding: 0.1,
          groupPadding: 0.1,
          states: {
            hover: {
              brightness: 0.1,
            },
          },
        };
        if (this.chartType === 'stacked-bar') {
          plotOptions.bar.stacking = 'normal';
        }
        break;

      case 'line':
      case 'area':
        plotOptions.line = {
          dataLabels: {
            enabled: false,
          },
          marker: {
            enabled: true,
            radius: 5,
            lineWidth: 2,
            lineColor: '#ffffff',
            fillColor: undefined, // Utilise la couleur de la série
            symbol: 'circle',
          },
          lineWidth: 2,
          states: {
            hover: {
              lineWidth: 3,
              marker: {
                radius: 6,
                lineWidth: 3,
              },
            },
          },
        };
        if (this.chartType === 'area') {
          plotOptions.area = {
            fillOpacity: 0.3,
          };
        }
        break;
    }

    return plotOptions;
  }

  private getSeriesData(): Highcharts.SeriesOptionsType[] {
    if (this.chartType === 'pie' || this.chartType === 'donut') {
      // Pour les graphiques circulaires, on utilise la première série
      const firstSeries = this.chartData[0];
      if (firstSeries && Array.isArray(firstSeries.data)) {
        return [
          {
            name: firstSeries.name,
            type: 'pie',
            data: firstSeries.data as { name: string; y: number }[],
            color: firstSeries.color,
          },
        ];
      }
    }

    // Pour les autres types de graphiques
    return this.chartData.map((series) => {
      let processedData = series.data;

      // Pour les graphiques avec catégories définies (comme stacked-column),
      // convertir les objets {name, y} en valeurs simples
      if (this.config.xAxis?.categories && Array.isArray(series.data)) {
        const categories = this.config.xAxis.categories;
        processedData = categories.map((category) => {
          const dataPoint = (series.data as { name: string; y: number }[]).find(
            (d) => d.name === category
          );
          return dataPoint ? dataPoint.y : 0;
        });
        console.log(
          `[ChartComponent] Processed data for ${series.name}:`,
          processedData
        );
      }

      return {
        name: series.name,
        type: this.getChartType() as any,
        data: processedData,
        color: series.color,
      };
    });
  }

  // Méthode privée pour mettre à jour les données du graphique existant
  private updateChartData(): void {
    if (!this.chart) return;

    try {
      // Recréer le graphique avec les nouvelles données
      this.chart.destroy();
      setTimeout(() => {
        this.createChart();
      }, 0);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du graphique:', error);
    }
  }

  // Méthode publique pour mettre à jour les données
  public updateChart(newData: ChartData[]): void {
    this.chartData = newData;
    if (this.chart) {
      this.chart.destroy();
    }
    setTimeout(() => {
      this.createChart();
    }, 0);
  }

  // Méthode publique pour redimensionner le graphique
  public resizeChart(): void {
    if (this.chart) {
      this.chart.reflow();
    }
  }
}
