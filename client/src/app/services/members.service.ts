import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../interfaces/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService implements OnInit {
  baseUrl = environment.urlBase;
  members: Member[] = [];

  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
  }

  getMembers() {
    if (this.members.length > 0) {
      return of(this.members); 
    }
    return this.http.get<Member[]>(`${this.baseUrl}user`).pipe(
      map((members) => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username: string) {
    const member = this.members.find((x) => x.userName == username);
    if (member) {
      return of(member);
    }
    return this.http.get<Member>(`${this.baseUrl}user/${username}`)
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}user`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member }
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}user/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}user/delete-photo/${photoId}`);
  }
}
