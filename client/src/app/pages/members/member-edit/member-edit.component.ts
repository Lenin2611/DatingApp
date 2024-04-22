import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../../interfaces/member';
import { Token } from '../../../interfaces/account';
import { AccountService } from '../../../services/account.service';
import { MembersService } from '../../../services/members.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { NgxPrettyDateModule } from 'ngx-pretty-date';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [CommonModule, TabsModule, FormsModule, PhotoEditorComponent, NgxPrettyDateModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  member: Member | undefined;
  user: Token | null = null;
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (!this.editForm?.pristine) {
      $event.returnValue = true;
    }
  }
  
  constructor(private accountService: AccountService, private memberService: MembersService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (response) => this.user = response,
      error: (error) => console.log(error)
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if (!this.user) {
      return;
    }
    this.memberService.getMember(this.user.username).subscribe({
      next: (response) => this.member = response,
      error: (error) => console.log(error)
    });
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      },
      error: (error) => console.log(error)
    });
  }
}
