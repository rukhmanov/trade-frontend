import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol',
  standalone: true
})
export class CurrencySymbolPipe implements PipeTransform {
  transform(currency: string | null | undefined): string {
    if (!currency) {
      return '₽'; // По умолчанию рубли
    }
    
    switch (currency.toUpperCase()) {
      case 'RUB':
        return '₽';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'JPY':
        return '¥';
      default:
        return currency; // Возвращаем исходную строку, если валюта не распознана
    }
  }
}
