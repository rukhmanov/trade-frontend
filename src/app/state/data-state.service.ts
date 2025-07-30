import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from 'src/app/entities/cards/types';

@Injectable({ providedIn: 'root' })
export class DataStateService {
  all$ = new BehaviorSubject<IProduct[] | null>(null);
  myCards$ = new BehaviorSubject<IProduct[] | null>(null);
  cardsInMyCart$ = new BehaviorSubject<IProduct[] | null>(null);

  constructor() {}
}
