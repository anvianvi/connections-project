import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GroupService } from '../services/group-serices.service';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { PostGropeResponse } from 'src/app/shared/interfaces/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { addCustomGroup } from 'src/app/state/actions/group.actions';
import { AppState } from 'src/app/state/state.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-group-modal',
  template: `
    <form [formGroup]="groupForm" class="create-grope-form">
      <mat-form-field class="create-group-field">
        <input matInput placeholder="Group Name" formControlName="groupName" />
        <mat-error
          *ngIf="groupForm.get('groupName')?.hasError('pattern')"
          class="my-mat-error"
        >
          Group name must be 1-30 characters and contain only latin letters,
          digits, or spaces.
        </mat-error>
      </mat-form-field>

      <div class="button-container">
        <button mat-button color="warn" (click)="onCancel()">Cancel</button>
        <button
          mat-button
          color="primary"
          [disabled]="!groupForm.valid"
          (click)="onCreate()"
        >
          Create
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .create-group-field {
        width: 100%;
        padding: 5px;
      }
      .my-mat-error {
        text-align: center;
      }
      .button-container {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }
    `,
  ],
})
export class CreateGroupModalComponent implements OnInit {
  groupForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateGroupModalComponent>,
    private fb: FormBuilder,
    private groupService: GroupService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>
  ) {
    this.groupForm = this.fb.group({
      groupName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]{1,30}$/)],
      ],
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.groupForm.valid) {
      this.postNewGrope(this.groupForm.value.groupName);
      console.log('Group Name:', this.groupForm.value.groupName);
      this.dialogRef.close();
    }
  }

  postNewGrope(name: string) {
    this.groupService.createNewGroupe(name).subscribe(
      (response: HttpResponse<PostGropeResponse>) =>
        this.handleCreateGroupSuccess(response),
      (error) => this.handleGroupListError(error)
    );
  }

  private handleCreateGroupSuccess(
    response: HttpResponse<PostGropeResponse>
  ): void {
    if (response.status === 201) {
      const newGroup = {
        id: { S: response.body?.groupID || '' },
        name: { S: this.groupForm.value.groupName },
        createdBy: { S: localStorage.getItem('uid') || '' },
        createdAt: { S: Date.now().toString() },
      };

      this.store.dispatch(addCustomGroup({ group: newGroup }));

      this.snackBar.open('Groupe Created', 'OK', {
        duration: 10000,
        panelClass: ['mat-accent'],
        horizontalPosition: 'right',
      });
      console.log(response.body?.groupID);
      console.log(response.body);
    }
  }

  private handleGroupListError(error: { error: { message: string } }): void {
    console.log(error);
    console.log(error.error.message);
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
}
