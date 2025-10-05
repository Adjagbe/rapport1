import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import {
  GRAPH_COLOR_SCHEME,
  HIGHCHART_LANG_OPTIONS,
} from '../../../app-models';

interface ExtendedXAxis extends Highcharts.XAxisOptions {
  plotLines: Array<any>;
}
interface ExtendPlotLines extends Highcharts.PlotOptions {
  plotLines: number;
  filter?: {
    operator: string;
    property: string;
    value: number;
  };
}
interface PlotSeriesOptions extends Highcharts.PlotSeriesOptions {
  plotLines: number;
}

@Component({
  selector: 'app-multi-type-chart',
  standalone: true,
  templateUrl: './multi-type-chart.component.html',
  styleUrls: ['./multi-type-chart.component.scss'],
})
export class MultiTypeChartComponent implements OnInit, AfterViewChecked {
  @Input() chartId: any = '';
  @Input() height: string = '';
  @Input() datas: any = undefined;
  @Input() unity!: string;
  @Input() type: string = 'column';
  @Input() columnWidth: number = 15;
  @Input() pointPadding: number = 2;
  @Input() centerValue: string = ''; // Nouvelle propriété pour la valeur au centre du pie chart
  //
  @Output() returnData: EventEmitter<any> = new EventEmitter();
  @ViewChild('charchartLineReftRef') componentRef: any;
  //
  highcharts: typeof Highcharts = Highcharts;
  theme: string = 'dark';
  chartConstructor = 'chart';
  chart: Highcharts.Options = {};
  updateChart: boolean = false;
  constructor() {
    this.highcharts.setOptions({
      colors: GRAPH_COLOR_SCHEME,
      lang: HIGHCHART_LANG_OPTIONS,
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.datas) {
      // Gérer les différents formats de données
      let series: any, categories: string[];

      if (this.datas.series && this.datas.categories) {
        // Nouveau format: { series: [...], categories: [...] }
        series = this.datas.series;
        categories = this.datas.categories;
      } else if (Array.isArray(this.datas)) {
        // Ancien format: Array de séries
        series = this.datas;
        categories = [];
      } else {
        // Format inconnu, utiliser des valeurs par défaut
        series = [];
        categories = [];
      }

      this.configChart(series, categories);
    }
  }

  ngAfterViewChecked(): void {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('chart a recu ses donnees: ', this.datas);

    if (changes['datas'] && this.datas && !changes['datas'].firstChange) {
      // Gérer les différents formats de données
      let series: any, categories: string[];

      if (this.datas.series && this.datas.categories) {
        // Nouveau format: { series: [...], categories: [...] }
        series = this.datas.series;
        categories = this.datas.categories;
        console.log('multi-type-chart - nouveau format détecté:', {
          series,
          categories,
        });
      } else if (Array.isArray(this.datas)) {
        // Ancien format: Array de séries
        series = this.datas;
        categories = [];
        console.log('multi-type-chart - ancien format détecté:', {
          series,
          categories,
        });
      } else {
        // Format inconnu, utiliser des valeurs par défaut
        series = [];
        categories = [];
        console.log('multi-type-chart - format inconnu, valeurs par défaut');
      }

      this.configChart(series, categories, this.datas.drilldown);
      return;
    }
  }

  configChart(_series: any, _categories: any, _drilldown?: any) {
    console.warn('config chart called !');
    console.log('configChart - series:', _series);
    console.log('configChart - categories:', _categories);
    this.chart = {};

    // Gérer les cas où _categories est undefined ou null
    const categories = _categories || [];
    const series = _series || [];

    this.chart = {
      exporting: {
        enabled: true,
      },
      colors: this.type === 'pie' ? ['#28A169', '#F39C12'] : GRAPH_COLOR_SCHEME,
      chart: {
        renderTo: `${this.chartId}`,
        type: this.type,
      },
      title: {
        text: '',
      },
      subtitle:
        this.type === 'pie'
          ? {
              text:
                '<span style="font-size:22px;font-weight:700;line-height:1">' +
                this.centerValue +
                '</span><br/><span style="font-size:13px;font-weight:400;line-height:1.2">Total des applications</span>',
              verticalAlign: 'middle',
              floating: true,
              y: 0,
              style: {
                color: '#454545',
                textAlign: 'center',
              },
              useHTML: true,
            }
          : {
              text: '',
            },
      legend:
        this.type === 'pie'
          ? {
              enabled: true,
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
              squareSymbol: true,
              symbolRadius: 1,
              itemStyle: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#454545',
                margin: '16px 0 0 0',
              },
              itemMarginTop: 8,
              itemMarginBottom: 8,
              padding: 8,
              floating: false,
              useHTML: false,
            }
          : {
              enabled: true,
              alignColumns: false,
              squareSymbol: true,
              symbolRadius: 1,
              itemStyle: {
                fontSize: '10px',
              },
            },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: categories,
        crosshair: true,
        labels: {
          rotation: 0,
        },
        lineWidth: 0,
        tickLength: 0,
        gridLineWidth: 0,
      },
      yAxis: [
        {
          min: 0,
          grid: {
            enabled: false,
            borderWidth: 0,
          },
          title: { text: '' },
          gridLineDashStyle: 'Dash',
          labels: {
            enabled: true,
          },
        },
        {
          min: 0,
          grid: {
            enabled: false,
            borderWidth: 0,
          },
          title: { text: '' },
          gridLineDashStyle: 'Dash',
          labels: {
            enabled: false,
          },
        },
        {
          min: 0,
          grid: {
            enabled: false,
            borderWidth: 0,
          },
          title: { text: '' },
          gridLineDashStyle: 'Dash',
          labels: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        headerFormat:
          '<span style="padding-left : .5rem; font-size:.85rem; font-weight:bold;">{point.key}</span><table >',
        pointFormat:
          '<tr><td style="  color:{series.color}; padding:0; line-height : 1; font-size:.8rem;">{series.name}: </td>' +
          '<td style="padding:0; padding-left : .5rem; font-size:.8rem; line-height : 1;"><b>{point.y}{point.surfix}</b></td></tr>',
        footerFormat: '</table>',
        valueSuffix: this.unity || this.unity === '' ? this.unity : ' %',
        shared: true,
        useHTML: true,
        style: {
          fontSize: '.3rem',
        },
      },
      plotOptions: {
        line: {
          lineWidth: 4,
          // zIndex: 4,
          dataLabels: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            color: '#333333',
            enabled: true,
            defer: true,
            format: '{y}{point.surfix}',
            style: {
              fontSize: '11px',
              fontWeight: 'bold',
              textOutline: '1px contrast',
            },
            formatter: () => _series + '%',
          },
        } as any,
        column: {
          stacking: 'normal',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#ffffff',
          pointWidth: this.columnWidth,
          pointPadding: this.pointPadding,
          // zIndex: 1,
          dataLabels: {
            enabled: true,
            borderWidth: 0,
            defer: true,
            format: '{y}{point.surfix}',
            style: {
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#333333',
            },
          },
        } as any,
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '75%',
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.0f}%',
            style: {
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#333333',
            },
            distance: 20,
          },
          center: ['50%', '50%'],
          size: '80%',
        },
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, '#ff790082'],
              [1, '#ff790026'],
            ],
          },

          lineWidth: 2,
          marker: {
            animation: false,
            enabled: true,
            fillColor: '#ffffff',
            lineColor: '#ff7900',
            lineWidth: 2,
          },
        },
        bar: {
          borderRadius: 20,
          dataLabels: {
            enabled: true,
            borderWidth: 0,
            defer: true,
            format: '{y}{point.surfix}',
            style: {
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#333333',
            },
          },
          borderWidth: 0,
          pointWidth: 10,
          groupPadding: 300,
        },
      },
      series: [...series],
      responsive: undefined,
    };
    if (_drilldown) {
      this.chart.drilldown = _drilldown;
    }
    this.highcharts.chart(this.chartId, this.chart);
    // this.updateChart = true;
  }

  private getTotalForPieChart(series: any[]): string {
    if (!series || series.length === 0) return '0';

    let total = 0;
    series.forEach((s) => {
      if (s.data && Array.isArray(s.data)) {
        s.data.forEach((point: any) => {
          total += point.y || 0;
        });
      }
    });

    return total.toString();
  }
}
