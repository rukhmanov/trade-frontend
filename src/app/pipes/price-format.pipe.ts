import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
  standalone: true
})
export class PriceFormatPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '0';
    }
    
    // Преобразуем в число
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numericValue)) {
      return '0';
    }
    
    // Форматируем число с пробелами после каждых 3 знаков
    return numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
