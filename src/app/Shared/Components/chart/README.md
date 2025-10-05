# Composant Graphique Réutilisable

Ce composant permet d'afficher différents types de graphiques en utilisant Highcharts. Il est conçu pour être facilement réutilisable et personnalisable.

## Installation

Assurez-vous que Highcharts est installé dans votre projet :

```bash
npm install highcharts @types/highcharts
```

## Utilisation

### Import du composant

```typescript
import { ChartComponent, ChartType, ChartData, ChartConfig } from "./Shared/Components/chart/chart.component";
```

### Types de graphiques supportés

- `line` - Graphique en ligne
- `column` - Graphique en colonnes
- `bar` - Graphique en barres horizontales
- `pie` - Graphique circulaire
- `donut` - Graphique en anneau
- `area` - Graphique en aire
- `stacked-column` - Graphique en colonnes empilées
- `stacked-bar` - Graphique en barres empilées

### Exemple d'utilisation basique

```html
<app-chart [chartType]="'line'" [chartData]="mesDonnees" [config]="maConfig" height="400px" width="100%"></app-chart>
```

### Structure des données

#### Pour les graphiques linéaires, colonnes, barres et aires :

```typescript
const chartData: ChartData[] = [
  {
    name: "Série 1",
    data: [10, 20, 30, 40, 50],
    color: "#28A169", // Optionnel
  },
  {
    name: "Série 2",
    data: [15, 25, 35, 45, 55],
    color: "#FF6B35", // Optionnel
  },
];
```

#### Pour les graphiques circulaires (pie/donut) :

```typescript
const chartData: ChartData[] = [
  {
    name: "Répartition",
    data: [
      { name: "Certifiés", y: 70 },
      { name: "Non certifiés", y: 30 },
    ],
  },
];
```

### Configuration

```typescript
const config: ChartConfig = {
  title: "Titre du graphique",
  subtitle: "Sous-titre optionnel",
  xAxis: {
    categories: ["Jan", "Fév", "Mar", "Avr", "Mai"],
    title: "Mois",
  },
  yAxis: {
    title: "Valeurs",
    min: 0,
    max: 100,
  },
  colors: ["#28A169", "#FF6B35", "#4A90E2"], // Couleurs personnalisées
  legend: {
    enabled: true,
    layout: "horizontal",
    align: "center",
    verticalAlign: "bottom",
  },
};
```

## Exemples concrets

### 1. Graphique Donut - Répartition des certifications

```typescript
const certificationData: ChartData[] = [
  {
    name: "Certifications",
    data: [
      { name: "Certifiés", y: 70 },
      { name: "Non certifiés", y: 30 },
    ],
  },
];

const donutConfig: ChartConfig = {
  title: "24 Total des applications",
  colors: ["#28A169", "#FF6B35"],
};
```

```html
<app-chart [chartType]="'donut'" [chartData]="certificationData" [config]="donutConfig" height="300px"></app-chart>
```

### 2. Graphique Line - Evolution temporelle

```typescript
const evolutionData: ChartData[] = [
  {
    name: "IT & Digital",
    data: [20, 35, 45, 60, 75, 85, 80, 70, 65, 60, 55, 50],
    color: "#F39C12",
  },
  {
    name: "Finance",
    data: [15, 25, 40, 55, 70, 80, 85, 90, 85, 80, 75, 70],
    color: "#9B59B6",
  },
];

const lineConfig: ChartConfig = {
  xAxis: {
    categories: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    title: "Mois",
  },
  yAxis: {
    title: "Pourcentage (%)",
    min: 0,
    max: 100,
  },
};
```

### 3. Graphique Bar - Taux de réponse

```typescript
const responseData: ChartData[] = [
  {
    name: "Taux de réponse",
    data: [36, 76, 35, 43, 85, 85],
    color: "#E91E63",
  },
];

const barConfig: ChartConfig = {
  xAxis: {
    categories: ["IT & Digital", "Finance", "Marketing", "RH", "Sécurité", "Admin"],
    title: "Directions",
  },
  yAxis: {
    title: "Pourcentage (%)",
    min: 0,
    max: 100,
  },
};
```

### 4. Graphique Stacked Column - Données empilées

```typescript
const stackedData: ChartData[] = [
  {
    name: "Certifiés",
    data: [600, 450, 300, 350, 800, 700],
    color: "#28A169",
  },
  {
    name: "Non certifiés",
    data: [200, 150, 100, 200, 100, 150],
    color: "#FF6B35",
  },
];

const stackedConfig: ChartConfig = {
  xAxis: {
    categories: ["PCAM", "Rapportage", "Suivi Orange", "Travail auto", "Reversement", "Digi Budget"],
    title: "Directions",
  },
  yAxis: {
    title: "Nombre de comptes",
    min: 0,
    max: 900,
  },
};
```

## Méthodes publiques

### updateChart(newData: ChartData[])

Met à jour les données du graphique :

```typescript
@ViewChild(ChartComponent) chartComponent!: ChartComponent;

updateChartData() {
  const newData: ChartData[] = [
    { name: 'Nouvelles données', data: [1, 2, 3, 4, 5] }
  ];
  this.chartComponent.updateChart(newData);
}
```

### resizeChart()

Redimensionne le graphique (utile lors de changements de taille de fenêtre) :

```typescript
@ViewChild(ChartComponent) chartComponent!: ChartComponent;

onWindowResize() {
  this.chartComponent.resizeChart();
}
```

## Personnalisation des couleurs

Le composant utilise par défaut une palette de couleurs moderne :

- `#28A169` - Vert
- `#FF6B35` - Orange
- `#4A90E2` - Bleu
- `#9B59B6` - Violet
- `#E74C3C` - Rouge
- `#F39C12` - Jaune
- `#1ABC9C` - Turquoise
- `#34495E` - Gris foncé

Vous pouvez personnaliser les couleurs via la propriété `colors` dans la configuration.

## Responsive Design

Le composant est entièrement responsive et s'adapte automatiquement aux différentes tailles d'écran. Les graphiques se redimensionnent automatiquement lors des changements de taille de fenêtre.

## Accessibilité

Le composant inclut des fonctionnalités d'accessibilité intégrées de Highcharts :

- Support des lecteurs d'écran
- Navigation au clavier
- Contraste des couleurs optimisé
