import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  coordinates$ = new BehaviorSubject<[number, number] | null>(null);
  coordinatesTitle$ = new BehaviorSubject(null);
  coordinatesForGeocoder$ = new BehaviorSubject<[number, number] | null>(null);

  constructor() {}
}
