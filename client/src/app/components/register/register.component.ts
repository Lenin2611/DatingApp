import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Register } from '../../interfaces/account';
import { AccountService } from '../../services/account.service';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ToastrModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();

  model: Register = {
    username: '',
    password: ''
  };
  validationErrors: string[] = [];

  constructor(private accountService: AccountService) { }

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel(),
      error: (error) => {
        console.log(error);
        this.validationErrors = error;
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
