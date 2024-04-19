import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/account';
import { AccountService } from '../../services/account.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, AsyncPipe, RouterModule, ToastrModule, CommonModule, BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  model: User = {
    username: '',
    password: ''
  };

  constructor(public accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/members'),
      error: (error) => console.log(error.error)
    });
  }

  logout() {
    this.router.navigateByUrl('/');
    this.accountService.logout();
  }
}
