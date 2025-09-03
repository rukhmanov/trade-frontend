import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonSearchbar, IonItem, IonList } from '@ionic/angular/standalone';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MapService } from '../map/map.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-geodecoder',
  templateUrl: './geodecoder.component.html',
  styleUrls: ['./geodecoder.component.scss'],
  imports: [IonItem, IonList, IonSearchbar, FormsModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeodecoderComponent),
      multi: true,
    },
  ],
})
export class GeodecoderComponent implements ControlValueAccessor {
  destroy$ = new Subject();
  searchQuery: string = '';
  suggestions: any[] = [];
  value = null;
  @Output() onCoordinate = new EventEmitter();

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onChange(_: any) {}

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}

  constructor(private http: HttpClient, private mapService: MapService) {
    this.mapService.coordinatesForGeocoder$
      .pipe(takeUntil(this.destroy$))
      .subscribe((coordinates) => {
        if (coordinates) {
          this.getAddressFromCoordinates(coordinates);
          this.mapService.coordinatesForGeocoder$.next(null);
        }
      });
  }

  onSearchChange() {
    if (this.searchQuery.length < 3) {
      this.suggestions = [];
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      this.searchQuery
    )}&addressdetails=1&limit=5&countrycodes=${'ru'}`;

    this.http.get<any[]>(url).subscribe((results) => {
      this.suggestions = results;
    });
  }

  getAddressFromCoordinates(coordinates: any) {
    let address = '';
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[0]}&lon=${coordinates[1]}&addressdetails=1`;

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.display_name) {
          address = response.display_name; // Сохраняем наименование
          this.mapService.coordinatesTitle$.next(response.display_name);
        } else {
          console.error('Адрес не найден');
        }
      },
      (error) => {
        console.error('Ошибка при выполнении запроса:', error);
      }
    );
  }

  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.display_name;
    this.suggestions = [];
    this.value = suggestion;
    this.onCoordinate.emit([+suggestion.lat, +suggestion.lon]);
    this.mapService.coordinates$.next([+suggestion.lat, +suggestion.lon]);
    // Здесь можно обработать координаты:
    // suggestion.lat, suggestion.lon
  }
}
