import { Component, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
})
export class PhoneInputComponent implements ControlValueAccessor {
  phoneUtil = PhoneNumberUtil.getInstance();

  countries: { code: string; name: string; dialCode: string }[] = [];
  selectedCountry!: { code: string; name: string; dialCode: string };
  localNumber = '';
  rawLocalNumber = '';

  private onChange = (val: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.loadCountries();
    if (this.countries.length > 0) {
      this.selectedCountry = this.countries[0];
    }
  }

  loadCountries() {
    const regions = this.phoneUtil.getSupportedRegions();
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

    this.countries = Array.from(regions)
      .map((regionCode) => {
        const dialCode =
          '+' + this.phoneUtil.getCountryCodeForRegion(regionCode);
        return {
          code: regionCode,
          name: displayNames.of(regionCode) || regionCode,
          dialCode,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  onCountryChange() {
    this.localNumber = '';
    this.emitValue();
  }

  onPhoneInput(event: any) {
    this.rawLocalNumber = (event.detail.value || '')
      .replace(/\D/g, '')
      .slice(0, 10);
    this.localNumber = this.applyMask(this.rawLocalNumber);
    // this.localNumber = raw;
    this.emitValue();
  }

  applyMask(digits: string): string {
    let result = '';
    if (digits.length > 0) result += '(' + digits.slice(0, 3);
    if (digits.length >= 4) result += ') ' + digits.slice(3, 6);
    if (digits.length >= 7) result += ' ' + digits.slice(6, 10);
    return result;
  }

  emitValue() {
    this.onChange({
      code: this.selectedCountry?.dialCode,
      phone: this.rawLocalNumber,
    });
  }

  writeValue(value: string): void {
    if (!value) {
      this.localNumber = '';
      return;
    }
    const match = value.match(/^\+[\d]+\s+(.*)$/);
    this.localNumber = match ? match[1] : value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const allowed =
      /^[0-9]$/.test(e.key) ||
      ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key);
    if (!allowed) {
      e.preventDefault();
    }
  }
}
