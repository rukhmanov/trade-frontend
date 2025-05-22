import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStateService {
  all$ = new BehaviorSubject(null);
  myCards$ = new BehaviorSubject(null);
  cardsInMyCart$ = new BehaviorSubject(null);
  constructor() {}
}
