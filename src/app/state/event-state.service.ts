import { Injectable, signal, WritableSignal } from '@angular/core';
import { IEvent } from '../entities/events/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventStateService {
  all$ = new BehaviorSubject(null);
  myEvents$ = new BehaviorSubject(null);
  eventsWithMe$ = new BehaviorSubject(null);
  constructor() {}
}
