import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User, Token, Register } from '../interfaces/account';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private currentUserSource = new BehaviorSubject<Token | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  register(model: Register) {
    return this.http.post<Token>(`${environment.urlBase}account/register`, model).pipe(
      map((response) => {
        if (response) {
          localStorage.setItem('user', JSON.stringify(response));
          this.setCurrentUser(response);
        }
      })
    );
  }

  login(model: User) {
    return this.http.post<Token>(`${environment.urlBase}account/login`, model).pipe(
      map((response) => {
        if (response) {
          localStorage.setItem('user', JSON.stringify(response));
          this.setCurrentUser(response);
        }
      }) 
    );
  }

  setCurrentUser(user: Token) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  get(path: string) {
    this.http.get(`${environment.urlBase}${path}`);
  }
}
