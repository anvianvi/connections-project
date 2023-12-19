import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confiration-dialog.component';
import { GroupItem } from 'src/app/shared/interfaces/interfaces';
import { GroupService } from '../services/group-api.service';

@Component({
  selector: 'app-group-card',
  template: `<div
    class="group-card-container"
    [ngStyle]="{ background: isMygroupe ? '#DCBFFF' : '#F1EAFF' }"
  >
    <div class="group-name" (click)="openGroupe(group.id.S)">
      {{ group.name.S }}
    </div>
    <button
      mat-icon-button
      *ngIf="isMygroupe"
      (click)="openConfirmationDialog(group.id.S)"
    >
      <mat-icon>delete</mat-icon>
    </button>
  </div> `,
  styles: [
    `
      .group-card-container {
        display: flex;
        justify-content: space-between;
        max-width: 360px;
        align-items: center;
        border-radius: 5px;
        border: 1px solid rgb(198 175 243);
        margin-bottom: 5px;

        .group-name {
          display: flex;
          align-items: center;
          min-width: 300px;
          height: 50px;
          padding-left: 5px;
        }
        .group-name:hover {
          cursor: pointer;
          text-decoration: underline;
          font-weight: 500;
        }
      }
    `,
  ],
})
export class GrupCardComponent {
  isMygroupe = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    if (this.currentuser === this.group.createdBy.S) {
      this.isMygroupe = true;
    }
  }

  @Input() group!: GroupItem;
  @Input() currentuser!: string;

  openConfirmationDialog(groupeId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirmation',
        content: 'Are you sure you want to delete this group?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.groupService.handleDeleteSelectedGroup(groupeId);
      }
    });
  }

  openGroupe(groupId: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: { mygroupe: this.isMygroupe },
    };
    this.router.navigate(['/group', groupId], navigationExtras);
  }
}
