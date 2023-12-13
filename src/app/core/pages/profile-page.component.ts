import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateService } from '../services/data.service';

@Component({
  selector: 'app-profile-page',
  template: `
    <div class="profile-wrapper">
      <h3>Profile:</h3>
      <p><strong>User ID:</strong> {{ userId }}</p>
      <p><strong>Email:</strong> {{ userEmail }}</p>
      <p><strong>Creation Time:</strong> {{ profileCreationTime }}</p>
      <p><strong>User Name:</strong> {{ userName }}</p>
    </div>
  `,
  styles: [
    `
      ::ng-deep app-profile-page {
        display: flex;
        justify-content: center;
        padding: 100px;
      }

      .profile-wrapper {
        h3 {
          font-size: 30px;
        }
        p {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class ProfilePageComponent implements OnInit {
  userId!: string;
  userEmail!: string;
  profileCreationTime!: string;
  userName!: string;

  constructor(private dateService: DateService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('uid') || '';
    this.userEmail = localStorage.getItem('email') || '';
    this.profileCreationTime = localStorage.getItem('createdAt') || '';
    this.userName = localStorage.getItem('name') || '';
    this.profileCreationTime = this.dateService.formatUnixTimestamp(
      this.profileCreationTime
    );
  }
}
