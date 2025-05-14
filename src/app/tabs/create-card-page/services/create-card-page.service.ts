import { HttpClient } from '@angular/common/http';
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
    console.log(body);
    return this.http.post<any>(environment.base + 'products/', body);
  }

  loadImages(images: any): Observable<any> {
    console.log(images);
    return this.http.get(images, { responseType: 'blob' }).pipe(
      mergeMap((file: Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(environment.base + 'images/', file);
      })
    );
  }
}
