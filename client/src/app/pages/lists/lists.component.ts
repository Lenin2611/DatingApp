import { Component, OnInit } from '@angular/core';
import { Member } from '../../interfaces/member';
import { MembersService } from '../../services/members.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { Pagination } from '../../interfaces/pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [FormsModule, CommonModule, MemberCardComponent, ButtonsModule, PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit {
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.pagination = response.pagination;
        this.members = response.result;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
