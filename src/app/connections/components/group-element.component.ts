import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confiration-dialog.component';
import {
  GroupItem,
  ServerResponse,
} from 'src/app/shared/interfaces/interfaces';
import { GroupService } from '../services/group-serices.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/state.model';
import { remuveGroupe } from 'src/app/state/actions/group.actions';

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

        .group-name {
          display: flex;
          align-items: center;
          min-width: 300px;
          height: 30px;
          padding-left: 5px;
        }
        .group-name:hover {
          cursor: pointer;
          text-decoration: dashed;
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
    private store: Store<AppState>,
    private router: Router,
    private snackBar: MatSnackBar,
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
        this.deleteSelectedGroup(groupeId);
      }
    });
  }

  deleteSelectedGroup(id: string) {
    this.groupService.deleteGroup(id).subscribe(
      (response: HttpResponse<ServerResponse>) => {
        if (response && response.status === 200) {
          this.store.dispatch(remuveGroupe({ groupeId: id }));

          this.snackBar.open('Group deleted successfully', 'OK', {
            duration: 7000,
            panelClass: ['mat-accent'],
            horizontalPosition: 'right',
          });
        }
      },
      (error) => {
        this.snackBar.open(
          `Oops, something went wrong: ${error.error.message}`,
          'OK',
          {
            duration: 15000,
            panelClass: ['mat-error'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      }
    );
  }

  openGroupe(groupId: string) {
    console.log(groupId);
    // this.router.navigate(['/group', groupId]);
    console.log('implement open groupe');
  }
}
