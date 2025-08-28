import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMoneyFormat]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoneyFormatDirective),
      multi: true
    }
  ]
})
export class MoneyFormatDirective implements ControlValueAccessor {
  private onChange = (value: number) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  writeValue(value: number): void {
    if (value !== null && value !== undefined) {
      this.el.nativeElement.value = this.formatNumber(value);
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

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
      this.onChange(1000000000);
    } else {
      this.el.nativeElement.value = formattedValue; // Устанавливаем отформатированное значение
      this.onChange(numericValue);
    }
    this.onTouched();
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  private formatIntegerPart(integerPart: string): string {
    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Добавляем пробел как разделитель тысяч
  }

  private formatNumber(value: number): string {
    // Форматируем число с пробелами после каждых 3 знаков
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  private parseToNumber(value: string): number {
    // Убираем пробелы и заменяем запятую на точку для корректного преобразования
    return parseFloat(value.replace(/\s+/g, '').replace(',', '.'));
  }
}
