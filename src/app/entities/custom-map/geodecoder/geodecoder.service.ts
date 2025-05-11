import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeodecoderService {
  countryCode: string = '...';

  constructor(private http: HttpClient) {
    this.http.get<any>('http://ip-api.com/json/').subscribe((data) => {
      this.countryCode = data.countryCode.toLowerCase();
    });
  }

  getCountry() {
    return this.http.get<any>('http://ip-api.com/json/').pipe(
      map((data) => {
        return data.countryCode.toLowerCase();
      })
    );
  }
}
