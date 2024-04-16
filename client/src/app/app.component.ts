import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AccountService } from './services/account.service';
import { Token } from './interfaces/account';
import { HomeComponent } from './components/home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, HttpClientModule, CommonModule, NavComponent, HomeComponent, FormsModule, ToastrModule, NgxSpinnerModule],
})
export class AppComponent implements OnInit {
  title = 'Dating App';
  users: any;

  constructor(private accountService: AccountService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const userString = localStorage.getItem('user');
    if (!userString) {
      return;
    }
    const user: Token = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
