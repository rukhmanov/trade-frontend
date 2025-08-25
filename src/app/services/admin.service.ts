import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IUserAdmin {
  id: number;
  firstName?: string;
  secondName?: string;
  fullName?: string;
  email: string;
  roles: Array<{
    id: number;
    name: string;
    permissions: Array<{
      id: number;
      name: string;
    }>;
  }>;
  authService?: 'google' | 'yandex' | 'email' | string;
  avatarId?: string;
  avatarLoadError?: boolean;
  phone?: string;
  birthDate?: string;
  gender?: string;
  authId?: string;
  emailVerified?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = environment.base;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<{ status: number; data: IUserAdmin[] }> {
    return this.http.get<{ status: number; data: IUserAdmin[] }>(`${this.baseUrl}users/`);
  }

  getUserById(id: number): Observable<{ status: number; data: IUserAdmin }> {
    return this.http.get<{ status: number; data: IUserAdmin }>(`${this.baseUrl}users/${id}`);
  }

  deleteUser(id: number): Observable<{ status: number }> {
    return this.http.delete<{ status: number }>(`${this.baseUrl}users/${id}`);
  }

  setUserRoles(userId: number, roleIds: number[]): Observable<{ status: number; data: any }> {
    return this.http.post<{ status: number; data: any }>(`${this.baseUrl}users/set-roles`, {
      id: userId,
      roleIds: roleIds,
    });
  }

  setUserPermissions(userId: number, permissionIds: number[]): Observable<{ status: number; data: any }> {
    return this.http.post<{ status: number; data: any }>(`${this.baseUrl}users/set-permissions`, {
      id: userId,
      permissionIds: permissionIds,
    });
  }
}
