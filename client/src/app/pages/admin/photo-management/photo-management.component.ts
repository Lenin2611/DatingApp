import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Photo } from '../../../interfaces/photo';
import { take } from 'rxjs';

@Component({
  selector: 'app-photo-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-management.component.html',
  styleUrl: './photo-management.component.css'
})
export class PhotoManagementComponent implements OnInit {
  photos: Photo[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe({
      next: (response) => this.photos = response,
      error: (error) => console.log(error)
    })
  }

  approvePhoto(photoId: number) {
    this.adminService.approvePhoto(photoId).subscribe({
      next: () => this.photos?.splice(this.photos.findIndex(x => x.id === photoId), 1)
    })
  }

  rejectPhoto(photoId: number) {
    this.adminService.rejectPhoto(photoId).subscribe({
      next: () => this.photos?.splice(this.photos.findIndex(x => x.id === photoId), 1)
    })
  }
}
