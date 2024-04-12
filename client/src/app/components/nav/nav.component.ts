import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/account';
import { AccountService } from '../../services/account.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, NgIf, AsyncPipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  model: User = {
    username: '',
    password: ''
  };

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
      complete: () => console.log('Login completed.')
    });
  }

  logout() {
    this.accountService.logout();
  }
}
