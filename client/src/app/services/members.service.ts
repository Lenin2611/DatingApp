import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../interfaces/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../interfaces/pagination';
import { UserParams } from '../interfaces/userParams';
import { AccountService } from './account.service';
import { Token } from '../interfaces/account';

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
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.userParams = new UserParams(response);
          this.user = response;
        }
      }
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
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return this.getPaginatedResult<Member[]>(`${this.baseUrl}user`, params).pipe(
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

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => {
        if (response.body)
          paginatedResult.result = response.body;
        const pagination = response.headers.get('Pagination');
        if (pagination)
          paginatedResult.pagination = JSON.parse(pagination);
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }
}