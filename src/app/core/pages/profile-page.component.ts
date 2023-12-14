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
      <button *ngIf="!isEditing" (click)="startEditing()">Edit</button>
      <div *ngIf="isEditing">
        <input [(ngModel)]="editedName" placeholder="Enter your name" />
        <button (click)="saveChanges()" [disabled]="isSaving">Save</button>
        <button (click)="cancelEditing()" [disabled]="isSaving">Cancel</button>
      </div>
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
  editedName: string = '';
  isEditing: boolean = false;
  isSaving: boolean = false;

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

  startEditing() {
    this.isEditing = true;
    this.editedName = this.userName;
  }

  saveChanges() {
    // TODO: Implement HTTP request to update profile
    this.isSaving = true;
    // Assume a successful update for now
    this.userName = this.editedName;
    this.isEditing = false;
    this.isSaving = false;
    // TODO: Display success toast
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedName = ''; // Reset the edited name
  }
}
