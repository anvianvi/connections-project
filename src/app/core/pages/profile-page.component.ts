import { Component, OnInit } from '@angular/core';
import { DateService } from '../services/data.service';
import { ProfileService } from '../services/profile.service';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServerResponse } from 'src/app/shared/interfaces/interfaces';

@Component({
  selector: 'app-profile-page',
  template: `
    <div class="profile-wrapper">
      <h3>Profile:</h3>
      <p><strong>User ID:</strong> {{ userId }}</p>
      <p><strong>Email:</strong> {{ userEmail }}</p>
      <p><strong>Creation Time:</strong> {{ profileCreationTime }}</p>
      <div class="user-name-container">
        <strong>User Name: </strong>
        <button
          mat-icon-button
          class="edit-name-btn"
          *ngIf="!isEditing"
          (click)="startEditing()"
        >
          <mat-icon>edit</mat-icon>
        </button>
        <span *ngIf="!isEditing">{{ userName }}</span>
        <div *ngIf="isEditing" class="edit-name-block">
          <input [(ngModel)]="editedName" placeholder="Enter your name" />
          <button (click)="saveChanges()" [disabled]="isSaving">Save</button>
          <button (click)="cancelEditing()" [disabled]="isSaving">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep app-profile-page {
      }

      .user-name-container {
        display: flex;
        height: 50px;
        align-items: center;

        .edit-name-btn {
        }
        .edit-name-block {
          margin-left: 50px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
      }
      .profile-wrapper {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 20px;

        p {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 50px;
          margin: 0;
        }

        h3 {
          font-size: 30px;
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

  constructor(
    private dateService: DateService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {}

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
    this.isSaving = true;

    this.profileService.putUserName(this.editedName).subscribe(
      (response: HttpResponse<ServerResponse>) => {
        console.log(response);
        if (response.status === 201) {
          this.userName = this.editedName;
          localStorage.setItem('name', this.userName);
          this.snackBar.open('UserName successfulu changed!', 'OK', {
            duration: 2000,
            panelClass: ['mat-accent'],
            horizontalPosition: 'right',
          });

          this.isEditing = false;
          this.isSaving = false;
        }
      },
      (error) => {
        this.snackBar.open(`Uups smth go wrong ${error.message}`, 'OK', {
          duration: 5000,
          panelClass: ['mat-error'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.isSaving = false;
        this.isEditing = false;
        this.editedName = '';
      }
    );
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedName = '';
  }
}
