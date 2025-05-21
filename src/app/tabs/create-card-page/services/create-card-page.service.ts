import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { mergeMap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreateCardPageApiService {
  baseUrl = environment.base;
  image: any;

  constructor(private http: HttpClient, private _sanitized: DomSanitizer) {}

  createProduct(body: any): Observable<any> {
    return this.http.post<any>(environment.base + 'products/', body);
  }

  loadImages(files: File[]): any {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });
    return this.http.post<any>(environment.base + 'images/', formData);
  }
}
