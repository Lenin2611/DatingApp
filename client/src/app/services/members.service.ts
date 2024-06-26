import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../interfaces/member';
import { map, of } from 'rxjs';
import { UserParams } from '../interfaces/userParams';
import { AccountService } from './account.service';
import { Token } from '../interfaces/account';
import { getPaginatedResult, getPaginationHeaders } from '../helpers/paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService implements OnInit {
  baseUrl = environment.urlBase;
  members: Member[] = [];
  memberCache = new Map();
  userParams: UserParams | undefined;
  user: Token | undefined;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.subscribe({
      next: (response) => {
        if (response) {
          this.userParams = new UserParams(response);
          this.user = response;
        }
      }, 
      error: (error) => console.log(error)
    })
  }
  
  ngOnInit(): void {
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  getMembers(userParams: UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return getPaginatedResult<Member[]>(`${this.baseUrl}user`, params, this.http).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);
    if (member)
      return of(member);
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

  addLike(username: string) {
    return this.http.post(`${this.baseUrl}likes/${username}`, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Member[]>(`${this.baseUrl}likes`, params, this.http);
  }
}