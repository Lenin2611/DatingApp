import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, Token, Register } from '../interfaces/account';
import { BehaviorSubject, map } from 'rxjs';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl: string = environment.urlBase;
  private currentUserSource = new BehaviorSubject<Token | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  register(model: Register) {
    return this.http.post<Token>(`${this.baseUrl}account/register`, model).pipe(
      map((response) => {
        if (response) {
          this.setCurrentUser(response);
        }
      })
    );
  }

  login(model: User) {
    return this.http.post<Token>(`${this.baseUrl}account/login`, model).pipe(
      map((response) => {
        if (response) {
          this.setCurrentUser(response);
        }
      }) 
    );
  }

  setCurrentUser(user: Token) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.currentUser$ = this.currentUserSource;
    this.presenceService.createHubConnection(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.currentUser$ = this.currentUserSource;
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }
}
