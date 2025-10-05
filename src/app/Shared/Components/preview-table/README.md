# Composant Preview Table

Un composant de tableau de prévisualisation avec pagination et filtrage côté front-end, optimisé pour l'affichage de données uploadées.

## Fonctionnalités

- **Pagination côté front-end** : Gestion de la pagination sans appel au serveur
- **Filtrage en temps réel** : Recherche avec debounce de 300ms
- **Tri des colonnes** : Tri ascendant/descendant sur les colonnes marquées comme triables
- **Responsive design** : Adaptation automatique aux différentes tailles d'écran
- **Largeur non limitée** : Le tableau s'adapte au contenu sans limitation de largeur
- **Scroll horizontal/vertical** : Gestion du défilement avec scrollbars personnalisées

## Utilisation

### Import du composant

```typescript
import { PreviewTableComponent } from "src/app/Shared/Components/preview-table/preview-table.component";
```

### Dans le template

```html
<preview-table [columns]="columns" [datas]="datas" [pageSize]="15" [maxHeight]="'500px'"></preview-table>
```

### Configuration des colonnes

```typescript
columns = [
  { label: "Nom", key: "name", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Statut", key: "status", sortable: false },
];
```

### Propriétés d'entrée

| Propriété   | Type            | Défaut    | Description                           |
| ----------- | --------------- | --------- | ------------------------------------- |
| `columns`   | `Array<Column>` | `[]`      | Configuration des colonnes du tableau |
| `datas`     | `any[]`         | `[]`      | Données à afficher                    |
| `pageSize`  | `number`        | `10`      | Nombre d'éléments par page            |
| `maxHeight` | `string`        | `'400px'` | Hauteur maximale du tableau           |

### Structure des colonnes

```typescript
interface Column {
  label: string; // Libellé affiché dans l'en-tête
  key: string; // Clé correspondant à la propriété des données
  sortable?: boolean; // Si la colonne est triable (optionnel)
}
```

## Exemple complet

```typescript
import { Component } from "@angular/core";
import { PreviewTableComponent } from "src/app/Shared/Components/preview-table/preview-table.component";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [PreviewTableComponent],
  template: ` <preview-table [columns]="columns" [datas]="data" [pageSize]="20" [maxHeight]="'600px'"></preview-table> `,
})
export class ExampleComponent {
  columns = [
    { label: "ID", key: "id", sortable: true },
    { label: "Nom", key: "name", sortable: true },
    { label: "Email", key: "email", sortable: true },
    { label: "Date", key: "date", sortable: true },
  ];

  data = [
    { id: 1, name: "Jean Dupont", email: "jean@example.com", date: "2024-01-15" },
    { id: 2, name: "Marie Martin", email: "marie@example.com", date: "2024-01-16" },
  ];
}
```

## Fonctionnalités avancées

### Filtrage

- Sélection de la colonne à filtrer
- Recherche en temps réel avec debounce
- Bouton d'effacement du filtre
- Retour automatique à la première page lors du filtrage

### Tri

- Clic sur l'en-tête de colonne pour trier
- Indicateurs visuels de direction du tri
- Tri intelligent (chaînes, nombres, dates)
- Gestion des valeurs nulles/undefined

### Pagination

- Navigation entre les pages
- Affichage du nombre total d'éléments
- Informations sur la page courante
- Taille de page configurable

## Styles et personnalisation

Le composant utilise des classes CSS Bootstrap et des styles personnalisés. Vous pouvez surcharger les styles en modifiant le fichier `preview-table.component.scss`.

### Classes CSS principales

- `.preview-table-container` : Conteneur principal
- `.table-header` : En-tête avec filtres
- `.table-container` : Zone du tableau avec scroll
- `.pagination-container` : Zone de pagination

## Responsive

Le composant s'adapte automatiquement aux écrans mobiles :

- Filtres empilés verticalement sur mobile
- Taille de police réduite
- Espacement optimisé

## Performance

- Utilisation des signaux Angular pour la réactivité
- Debounce sur la recherche pour éviter les appels excessifs
- Pagination côté client pour de grandes quantités de données
- Optimisation des re-rendus avec `OnPush` strategy
