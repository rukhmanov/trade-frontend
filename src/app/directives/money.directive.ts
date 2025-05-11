import { Directive, HostListener, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[appMoneyFormat]', // Убедитесь, что данный селектор уникальный
})
export class MoneyFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    // Удаляем все символы, кроме цифр и запятой
    let input = this.el.nativeElement.value.replace(/[^0-9,]/g, '');

    // Разделяем целую и дробную части
    const parts = input.split(',');

    // Форматируем целую часть с пробелами как разделителями тысяч
    if (parts[0]) {
      parts[0] = this.formatIntegerPart(parts[0]);
    }

    // Объединяем обратно целую и дробную части
    const formattedValue = parts.join(',');

    // Преобразование отформатированного значения обратно в число
    const numericValue = this.parseToNumber(formattedValue);

    // Проверяем, не превышает ли значение 1 000 000 000
    if (numericValue > 1000000000) {
      this.el.nativeElement.value = '1 000 000 000'; // Устанавливаем максимальное значение
    } else {
      this.el.nativeElement.value = formattedValue; // Устанавливаем отформатированное значение
    }
  }

  private formatIntegerPart(integerPart: string): string {
    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Добавляем пробел как разделитель тысяч
  }

  private parseToNumber(value: string): number {
    // Убираем пробелы и заменяем запятую на точку для корректного преобразования
    return parseFloat(value.replace(/\s+/g, '').replace(',', '.'));
  }
}
