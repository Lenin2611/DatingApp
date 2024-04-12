import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Register } from '../../interfaces/account';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter();

  model: Register = {
    username: '',
    password: ''
  };

  constructor(private accountService: AccountService) {  }

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => this.cancel(),
      error: (error) => console.log(error),
      complete: () => console.log('Register completed.')
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
