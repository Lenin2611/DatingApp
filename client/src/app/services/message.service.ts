import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { getPaginatedResult, getPaginationHeaders } from '../helpers/paginationHelper';
import { Message } from '../interfaces/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Token } from '../interfaces/account';
import { BehaviorSubject, take } from 'rxjs';
import { Group } from '../interfaces/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.urlBase;
  hubUrl = environment.urlHub;
  public hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable()

  constructor(private http: HttpClient) { }

  createHubConnection(user: Token, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}message?user=${otherUsername}`, { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch((error) => console.log(error));
    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThreadSource.next(messages);
      this.messageThread$ = this.messageThreadSource;
    });
    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: (response) => {
          this.messageThreadSource.next([...response, message]);
          this.messageThread$ = this.messageThreadSource;
        }
      })
    });
    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.username == otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: (response) => {
            response.forEach((message) => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            });
            this.messageThreadSource.next([...response]);
            this.messageThread$ = this.messageThreadSource;
          }
        })
      }
    });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Message[]>(`${this.baseUrl}message`, params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(`${this.baseUrl}message/thread/${username}`);
  }

  async sendMessage(username: string, content: string) { 
    return this.hubConnection?.invoke('SendMessage', { recipientUsername: username, content }).catch((error) => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(`${this.baseUrl}message/${id}`)
  }
}
