import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    limit: number = 50,
    suffix: string = '...',
    preserveWords: boolean = true
  ): string {
    if (!value) return '';

    if (value.length <= limit) return value;

    if (preserveWords) {
      // Tronquer en préservant les mots complets
      const truncated = value.substring(0, limit);
      const lastSpace = truncated.lastIndexOf(' ');

      if (lastSpace > 0) {
        return truncated.substring(0, lastSpace) + suffix;
      }
    }

    return value.substring(0, limit) + suffix;
  }
}
