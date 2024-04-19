import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  registerMode = false;

  constructor(private memberService: MembersService) {
    this.memberService.members = [];
    this.memberService.memberCache = new Map();
  }

  ngOnInit(): void {
  }
  

  registerToggle() {
    this.registerMode = true;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
