import { Component, OnInit } from '@angular/core';
import { Member } from '../../../interfaces/member';
import { MembersService } from '../../../services/members.service';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (response) => this.members = response,
      error: (error) => console.log(error)
    });
  }
}
