import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Token } from '../interfaces/account';
import { Photo } from '../interfaces/photo';


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

  getPhotosForApproval() {
    return this.http.get<Photo[]>(`${this.baseUrl}admin/photo-to-moderate`);
  }
  
  approvePhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}admin/approve-photo/${photoId}`, {});
  }

  rejectPhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}admin/reject-photo/${photoId}`);
  }
}
