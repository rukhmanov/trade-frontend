import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAgeRange]', // Убедитесь, что данный селектор уникальный
})
export class AgeRangeDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    // Получаем текущее значение
    const value = this.el.nativeElement.value;

    // Удаляем все символы, кроме цифр
    const numericValue = value.replace(/[^0-9]/g, '');

    // Преобразуем в число
    const age = Number(numericValue);

    // Проверяем, в пределах ли диапазона от 18 до 99
    if (age < 18) {
      this.el.nativeElement.value = '18'; // Устанавливаем минимальное значение
    } else if (age > 99) {
      this.el.nativeElement.value = '99'; // Устанавливаем максимальное значение
    } else {
      this.el.nativeElement.value = numericValue; // Устанавливаем допустимое значение
    }
  }
}
