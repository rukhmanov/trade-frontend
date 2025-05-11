import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { EventStateService } from 'src/app/state/event-state.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventsApiService {
  baseUrl = environment.base;
  constructor(
    private http: HttpClient,
    private eventStateService: EventStateService
  ) {}

  getAllEvents(): Observable<any> {
    return this.http
      .get<any>(environment.base + 'events')
      .pipe(
        tap((allEvents) => this.eventStateService.allEvents$.next(allEvents))
      );
  }

  getMyEvents(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + 'events/my')
      .pipe(
        tap((allEvents) => this.eventStateService.myEvents$.next(allEvents))
      );
  }

  getEventById(id: number | string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'events/' + id);
  }

  getEventsWithMe(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + 'events/withMe')
      .pipe(
        tap((allEvents) => this.eventStateService.eventsWithMe$.next(allEvents))
      );
  }
}
