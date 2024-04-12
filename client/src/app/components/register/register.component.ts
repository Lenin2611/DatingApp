import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Register } from '../../interfaces/account';
import { AccountService } from '../../services/account.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ToastrModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();

  model: Register = {
    username: '',
    password: ''
  };

  constructor(private accountService: AccountService, private toastr: ToastrService) {  }

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel(),
      error: (error) => this.toastr.error(error.error),
      complete: () => console.log('Register completed.')
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
