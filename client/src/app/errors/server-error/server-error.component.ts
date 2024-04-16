import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css'
})
export class ServerErrorComponent {
  error: any;

  constructor(router: Router, accountService: AccountService) {
    const navigation = router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
    accountService.logout();
  }



}
