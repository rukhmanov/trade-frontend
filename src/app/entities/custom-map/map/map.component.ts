import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';
import { IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { MapService } from './map.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-map',
  styleUrls: ['./map.component.scss'],
  templateUrl: './map.component.html',
  imports: [IonIcon, IonFab, IonFabButton],
})
export class MapComponent implements AfterViewInit {
  @Output() onCoordinate = new EventEmitter();
  destroy$ = new Subject();

  private map!: L.Map;
  private marker!: L.Marker;
  private customIcon = L.icon({
    iconUrl: 'assets/images/target.png',
    iconSize: [40, 40], // Размер иконки
    iconAnchor: [20, 40], // Точка, которая будет соответствовать координатам
  });
  // Начальные координаты (например, Москва)
  private initialCoords = {
    lat: 55.7558,
    lng: 37.6173,
  };

  constructor(private mapService: MapService) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.loadMap();
    this.mapService.coordinates$
      .pipe(takeUntil(this.destroy$))
      .subscribe((coordinates) => {
        if (coordinates) {
          console.log(coordinates);
          if (this.marker) this.map.removeLayer(this.marker);
          this.marker = L.marker([coordinates[0], coordinates[1]], {
            title: 'Вы здесь',
            icon: this.customIcon,
          }).addTo(this.map);
          this.map.setView([coordinates[0], coordinates[1]], 14);
          this.mapService.coordinates$.next(null);
        }
      });
  }

  loadMap() {
    this.map = L.map('map').setView(
      [this.initialCoords.lat, this.initialCoords.lng],
      13
    );

    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Маркер начальный
    this.marker = L.marker([this.initialCoords.lat, this.initialCoords.lng], {
      draggable: true,
      icon: this.customIcon,
    }).addTo(this.map);

    // При клике по карте — переместить маркер и показать координаты
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.marker.setLatLng([lat, lng]);
      this.onCoordinate.emit([lat, lng]);
      this.mapService.coordinatesForGeocoder$.next([lat, lng]);
    });

    // При перетаскивании маркера — получить координаты
    this.marker.on('dragend', () => {
      const { lat, lng } = this.marker.getLatLng();
      this.onCoordinate.emit([lat, lng]);
      this.mapService.coordinatesForGeocoder$.next([lat, lng]);
    });
  }

  async locateUser() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      this.onCoordinate.emit([latitude, longitude]);
      this.mapService.coordinatesForGeocoder$.next([latitude, longitude]);
      if (this.marker) this.map.removeLayer(this.marker);
      this.marker = L.marker([latitude, longitude], {
        title: 'Вы здесь',
        icon: this.customIcon,
      }).addTo(this.map);
      this.map.setView([latitude, longitude], 14);
    } catch (err) {
      console.error('Ошибка:', err);
    }
  }
}
