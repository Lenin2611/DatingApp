import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { Token } from '../interfaces/account';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.urlHub;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUser$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: Token) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}presence`, { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch((error) => console.log(error));
    this.hubConnection.on('UserIsOnline', username => this.onlineUser$.pipe(take(1)).subscribe({
      next: (response) => {
        this.onlineUsersSource.next([...response, username]);
        this.onlineUser$ = this.onlineUser$;
      }
    }));
    this.hubConnection.on('UserIsOffline', username => this.onlineUser$.pipe(take(1)).subscribe({
      next: (response) => {
        this.onlineUsersSource.next(response.filter(x => x !== username));
        this.onlineUser$ = this.onlineUsersSource;
      }
    }));
    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsersSource.next(usernames);
      this.onlineUser$ = this.onlineUsersSource;
    });
    this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
      this.toastr.info(`${knownAs} has sent you a nre message! Click me to see it`)
        .onTap
        .pipe(take(1))
        .subscribe({
          next: () => this.router.navigateByUrl(`/members/${username}?tab=Messages`)
        });
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => console.log(error));
  }
}
