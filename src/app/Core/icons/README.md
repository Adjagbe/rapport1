# Composants d'icônes

Ce dossier contient tous les composants d'icônes réutilisables dans l'application.

## Structure

Chaque composant d'icône suit la convention suivante :

- **Sélecteur** : `.nom-icon` (classe CSS)
- **Standalone** : `true`
- **Template** : SVG inline

## Utilisation

### 1. Importer le composant

```typescript
import { CalendarIconComponent } from "src/app/Core/icons";
```

### 2. Ajouter aux imports du composant

```typescript
@Component({
  selector: 'app-mon-composant',
  standalone: true,
  imports: [
    CommonModule,
    CalendarIconComponent,
    // autres imports...
  ],
  // ...
})
```

### 3. Utiliser dans le template

```html
<div class="calendar-icon"></div>
```

## Icônes disponibles

### Icônes principales

- `CalendarIconComponent` - Icône calendrier
- `UserIconComponent` - Icône utilisateur
- `ArrowIconComponent` - Icône flèche

### Icônes existantes

- `ExportIconComponent` - Icône export
- `TrashIconComponent` - Icône poubelle
- `ReloadIconComponent` - Icône rechargement
- `SearchIconComponent` - Icône recherche
- Et bien d'autres...

## Créer une nouvelle icône

1. Créer un nouveau fichier `nom-icon.component.ts`
2. Suivre le pattern existant :

```typescript
import { Component } from "@angular/core";

@Component({
  selector: ".nom-icon",
  standalone: true,
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <!-- SVG content -->
    </svg>
  `,
})
export class NomIconComponent {}
```

3. Ajouter l'export dans `index.ts`
4. Utiliser avec `<div class="nom-icon"></div>`

## Avantages

- **Réutilisabilité** : Composants standalone réutilisables partout
- **Maintenabilité** : Centralisation des icônes
- **Performance** : Pas de duplication de code SVG
- **Cohérence** : Sélecteurs uniformes `.nom-icon`
