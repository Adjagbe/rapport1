import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewTableComponent } from './preview-table.component';

@Component({
  selector: 'preview-table-demo',
  standalone: true,
  imports: [CommonModule, PreviewTableComponent],
  template: `
    <div class="demo-container">
      <h2>Démonstration du composant Preview Table</h2>

      <preview-table
        [columns]="demoColumns"
        [datas]="demoData"
        [pageSize]="5"
        [maxHeight]="'400px'"
      ></preview-table>
    </div>
  `,
  styles: [
    `
      .demo-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      h2 {
        margin-bottom: 2rem;
        color: #333;
      }
    `,
  ],
})
export class PreviewTableDemoComponent {
  demoColumns = [
    { label: 'ID', key: 'id', sortable: true },
    { label: 'Nom', key: 'name', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Téléphone', key: 'phone', sortable: false },
    { label: 'Ville', key: 'city', sortable: true },
    { label: 'Statut', key: 'status', sortable: true },
  ];

  demoData = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '01 23 45 67 89',
      city: 'Paris',
      status: 'Actif',
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '01 98 76 54 32',
      city: 'Lyon',
      status: 'Actif',
    },
    {
      id: 3,
      name: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      phone: '01 11 22 33 44',
      city: 'Marseille',
      status: 'Inactif',
    },
    {
      id: 4,
      name: 'Sophie Bernard',
      email: 'sophie.bernard@email.com',
      phone: '01 55 66 77 88',
      city: 'Toulouse',
      status: 'Actif',
    },
    {
      id: 5,
      name: 'Lucas Petit',
      email: 'lucas.petit@email.com',
      phone: '01 99 88 77 66',
      city: 'Nantes',
      status: 'Actif',
    },
    {
      id: 6,
      name: 'Emma Roux',
      email: 'emma.roux@email.com',
      phone: '01 44 33 22 11',
      city: 'Strasbourg',
      status: 'Inactif',
    },
    {
      id: 7,
      name: 'Thomas Moreau',
      email: 'thomas.moreau@email.com',
      phone: '01 77 66 55 44',
      city: 'Bordeaux',
      status: 'Actif',
    },
    {
      id: 8,
      name: 'Julie Simon',
      email: 'julie.simon@email.com',
      phone: '01 22 33 44 55',
      city: 'Lille',
      status: 'Actif',
    },
    {
      id: 9,
      name: 'Antoine Michel',
      email: 'antoine.michel@email.com',
      phone: '01 66 55 44 33',
      city: 'Rennes',
      status: 'Inactif',
    },
    {
      id: 10,
      name: 'Camille Leroy',
      email: 'camille.leroy@email.com',
      phone: '01 88 99 00 11',
      city: 'Reims',
      status: 'Actif',
    },
  ];
}
