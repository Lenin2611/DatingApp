import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';
import { NgxPrettyDateModule } from 'ngx-pretty-date';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule, NgxPrettyDateModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  messageContent = '';

  constructor(public messageService: MessageService) { }

  ngOnInit(): void { }

  async sendMessage() {
    if (!this.username)
      return;
    this.messageService.sendMessage(this.username, this.messageContent)!.then(() => {
      this.messageForm?.reset();
    });
  }
}
