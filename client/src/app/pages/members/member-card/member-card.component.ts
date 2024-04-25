import { Component, Input } from '@angular/core';
import { Member } from '../../../interfaces/member';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MembersService } from '../../../services/members.service';
import { ToastrService } from 'ngx-toastr';
import { PresenceService } from '../../../services/presence.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  @Input() member: Member | undefined;

  constructor(private memberService: MembersService, private toastr: ToastrService, public presenceService: PresenceService) { }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastr.success(`You have liked ${member.knownAs}`)
    });
  }
}
