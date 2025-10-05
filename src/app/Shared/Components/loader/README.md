# Composant Loader

Ce composant fournit un loader réutilisable avec une animation SVG personnalisée.

## Fonctionnalités

- **Animation SVG personnalisée** : Utilise votre SVG avec des animations fluides
- **Overlay semi-transparent** : Bloque l'interaction avec le contenu en arrière-plan
- **Contrôle via BehaviorSubject** : Gestion centralisée de l'état du loader
- **Responsive** : S'adapte aux différentes tailles d'écran
- **Animations fluides** : Transitions douces pour l'apparition/disparition

## Utilisation

### 1. Injection du service

```typescript
import { LoaderService } from 'src/app/Core/Services/loader.service';

export class MonComposant {
  #loaderService = inject(LoaderService);

  // Méthodes disponibles
  this.#loaderService.show();    // Affiche le loader
  this.#loaderService.hide();    // Cache le loader
}
```

### 2. Utilisation simple

```typescript
async chargerDonnees() {
  this.#loaderService.show();
  try {
    // Votre logique ici
    await this.service.getData();
  } finally {
    this.#loaderService.hide();
  }
}
```

### 3. Utilisation avec withLoader (recommandé)

```typescript
async chargerDonnees() {
  return this.#loaderService.withLoader(async () => {
    // Votre logique ici
    return await this.service.getData();
  });
}
```

### 4. Utilisation avec RxJS

```typescript
this.service
  .getData()
  .pipe(
    tap(() => this.#loaderService.show()),
    finalize(() => this.#loaderService.hide())
  )
  .subscribe({
    next: (data) => {
      // Traitement des données
    },
    error: (error) => {
      // Gestion d'erreur
    },
  });
```

## Intégration dans les services

Le service `ApplicationService` montre un exemple d'intégration :

```typescript
async getApplications() {
  return this.#loaderService.withLoader(async () => {
    // Logique de récupération des données
    return this.#httpClient.post(...).toPromise();
  });
}
```

## Styles personnalisés

Le loader utilise les couleurs de votre thème :

- Couleur principale : `#FFFFFF` (blanc)
- Overlay : `rgba(0, 0, 0, 0.5)`
- Container : `rgba(255, 255, 255, 0.95)` avec effet de flou

## Responsive

Le loader s'adapte automatiquement :

- Desktop : 50px
- Tablet : 40px
- Mobile : 35px

## Bonnes pratiques

1. **Toujours utiliser `withLoader`** quand possible pour une gestion automatique
2. **Gérer les erreurs** en s'assurant que le loader est caché
3. **Éviter les appels multiples** - le loader est global
4. **Utiliser dans les services** plutôt que dans les composants pour une meilleure réutilisabilité
