import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../entities/auth/types';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { DataStateService } from './data-state.service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  me$ = new BehaviorSubject<IUser | null>(null);
  myAvatar$ = new BehaviorSubject<Blob | null>(null);
  token$ = new BehaviorSubject<string | null>('');

  constructor(
    private http: HttpClient,
    private dataStateService: DataStateService
  ) {
    this.token$.subscribe((token) => {
      if (token) {
        localStorage.setItem('token', token);
      }
    });

    const tokenFromStorage = localStorage.getItem('token');

    if (tokenFromStorage) {
      this.token$.next(tokenFromStorage);
      this.me$.next(jwtDecode(tokenFromStorage));
    }
  }

  getYandexAvatar(id: number | string) {
    return this.http.get(
      `https://avatars.yandex.net/get-yapic/${id}/islands-200`,
      { responseType: 'blob' }
    );
  }
}
