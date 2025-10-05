import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PageItem {
  type: 'page' | 'ellipsis';
  value?: number;
}

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  // getVisiblePages(): PageItem[] {
  //   const totalPages = this.totalPages;
  //   const currentPage = this.currentPage;
  //   const items: PageItem[] = [];

  //   if (totalPages <= 3) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       items.push({ type: 'page', value: i });
  //     }
  //     return items;
  //   }

  //   // Cas 1: début (1 2 3 ... N)
  //   if (currentPage <= 3) {
  //     items.push({ type: 'page', value: 1 });
  //     items.push({ type: 'page', value: 2 });
  //     items.push({ type: 'page', value: 3 });
  //     items.push({ type: 'ellipsis' });
  //     items.push({ type: 'page', value: totalPages });
  //     return items;
  //   }

  //   // Cas 2: fin (N-2 N-1 N) sans ellipses
  //   if (currentPage >= totalPages - 2) {
  //     items.push({ type: 'page', value: totalPages - 2 });
  //     items.push({ type: 'page', value: totalPages - 1 });
  //     items.push({ type: 'page', value: totalPages });
  //     return items;
  //   }

  //   // Cas 3: milieu (P P+1 P+2 ... N)
  //   items.push({ type: 'page', value: currentPage });
  //   items.push({ type: 'page', value: currentPage + 1 });
  //   items.push({ type: 'page', value: currentPage + 2 });
  //   items.push({ type: 'ellipsis' });
  //   items.push({ type: 'page', value: totalPages });
  //   return items;
  // }

  getVisiblePages(): PageItem[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const items: PageItem[] = [];

    if (totalPages <= 5) {
      // Si 5 pages ou moins, on affiche tout
      for (let i = 1; i <= totalPages; i++) {
        items.push({ type: 'page', value: i });
      }
      return items;
    }

    // Cas 1: début (1 2 3 ... N)
    if (currentPage <= 3) {
      items.push({ type: 'page', value: 1 });
      items.push({ type: 'page', value: 2 });
      items.push({ type: 'page', value: 3 });
      items.push({ type: 'ellipsis' });
      items.push({ type: 'page', value: totalPages });
      return items;
    }

    // Cas 2: fin (1 ... N-2 N-1 N) - CORRECTION ICI
    if (currentPage >= totalPages - 2) {
      items.push({ type: 'page', value: 1 });
      items.push({ type: 'ellipsis' });
      items.push({ type: 'page', value: totalPages - 2 });
      items.push({ type: 'page', value: totalPages - 1 });
      items.push({ type: 'page', value: totalPages });
      return items;
    }

    // Cas 3: milieu (1 ... P-1 P P+1 ... N)
    items.push({ type: 'page', value: 1 });
    items.push({ type: 'ellipsis' });
    items.push({ type: 'page', value: currentPage - 1 });
    items.push({ type: 'page', value: currentPage });
    items.push({ type: 'page', value: currentPage + 1 });
    items.push({ type: 'ellipsis' });
    items.push({ type: 'page', value: totalPages });
    return items;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
