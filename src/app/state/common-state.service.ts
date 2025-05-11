import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonStateService {
  pending$ = new BehaviorSubject<boolean>(false);
  constructor() {}
}
