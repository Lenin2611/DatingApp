import { NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AccountService } from './services/account.service';
import { Token } from './interfaces/account';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HttpClientModule, NgFor, NavComponent, HomeComponent, FormsModule],
})
export class AppComponent implements OnInit {
  title = 'Dating App';
  users: any;

  constructor(private http: HttpClient, private accountService: AccountService) { }

  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/user').subscribe({
      next: (response) => this.users = response,
      error: (error) => console.log(error),
      complete: () => console.log('Request completed.'),
    });
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) {
      return;
    }
    const user: Token = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
