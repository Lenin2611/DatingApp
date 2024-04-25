import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../../interfaces/member';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { NgxPrettyDateModule } from 'ngx-pretty-date';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from '../../../services/message.service';
import { Message } from '../../../interfaces/message';
import { ToastrService } from 'ngx-toastr';
import { PresenceService } from '../../../services/presence.service';
import { AccountService } from '../../../services/account.service';
import { Token } from '../../../interfaces/account';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, TabsModule, GalleryModule, NgxPrettyDateModule, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = []
  user?: Token;

  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessageService, private toastr: ToastrService, public presenceService: PresenceService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.user = response;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (response) => this.member = response['member']
    });
    this.route.queryParams.subscribe({
      next: (response) => response['tab'] && this.selectTab(response['tab'])
    });
    this.getImages();
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user) {
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: (response) => this.messages = response
      });
    }
  }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastr.success(`You have liked ${member.knownAs}`)
    });
  }

  getImages() {
    if (!this.member) {
      return;
    }
    for (const photo of this.member?.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
    }
  }
}
