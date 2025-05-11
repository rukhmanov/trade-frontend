import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'errorText',
  standalone: true,
  pure: false,
})
export class ErrorTextPipe implements PipeTransform {
  transform(constrol: FormControl): unknown {
    if (constrol.hasError('required')) {
      return 'Обязательное поле';
    }
    if (constrol.hasError('minlength')) {
      return `Минимум ${constrol.getError('minlength').requiredLength} символа`;
    }
    return null;
  }
}
