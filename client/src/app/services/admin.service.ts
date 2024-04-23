import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Token } from '../interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.urlBase;

  constructor(private http: HttpClient) { }

  getUsersWithRoles() {
    return this.http.get<Token[]>(`${this.baseUrl}admin/users-with-roles`);
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post<string[]>(`${this.baseUrl}admin/edit-roles/${username}?roles=${roles}`, {});
  }
}