import { Component, AfterViewInit } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';

declare const ymaps: any;

@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.html'],
  imports: [IonInput],
})
export class YandexMapComponent implements AfterViewInit {
  map: any;
  selectedAddress: string = '';

  ngAfterViewInit() {
    ymaps.ready(() => {
      this.initMap();
      this.initSuggest();
    });
  }

  initMap() {
    this.map = new ymaps.Map('map', {
      center: [55.751244, 37.618423], // Москва
      zoom: 10,
    });

    this.map.events.add('click', (e: any) => {
      const coords = e.get('coords');

      ymaps.geocode(coords).then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0);
        const name = firstGeoObject
          ? firstGeoObject.getAddressLine()
          : 'Неизвестный объект';
        this.selectedAddress = name;

        this.placeMarker(coords, name);
      });
    });
  }

  initSuggest() {
    const suggestView = new ymaps.SuggestView('suggest');
    suggestView.events.add('select', (e: any) => {
      const selectedAddress = e.get('item').value;
      this.searchAddress(selectedAddress);
    });
  }

  searchAddress(address: string) {
    ymaps.geocode(address).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      if (firstGeoObject) {
        const coords = firstGeoObject.geometry.getCoordinates();
        const name = firstGeoObject.getAddressLine();

        this.map.setCenter(coords, 15);
        this.placeMarker(coords, name);
        this.selectedAddress = name;
      } else {
        alert('Адрес не найден');
      }
    });
  }

  placeMarker(coords: number[], label: string) {
    const placemark = new ymaps.Placemark(coords, {
      balloonContent: label,
    });

    this.map.geoObjects.removeAll();
    this.map.geoObjects.add(placemark);
    placemark.balloon.open();
  }
}
