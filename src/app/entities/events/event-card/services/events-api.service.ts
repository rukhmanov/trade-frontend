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

  getAll(): Observable<any> {
    return this.http
      .get<any>(environment.base + 'products/')
      .pipe(tap((all) => this.eventStateService.all$.next(all)));
  }

  getMyEvents(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + 'events/my')
      .pipe(tap((all) => this.eventStateService.myEvents$.next(all)));
  }

  getEventById(id: number | string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'events/' + id);
  }

  getEventsWithMe(): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + 'events/withMe')
      .pipe(tap((all) => this.eventStateService.eventsWithMe$.next(all)));
  }
}
