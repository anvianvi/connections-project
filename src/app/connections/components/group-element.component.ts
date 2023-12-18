import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GroupItem } from 'src/app/shared/interfaces/interfaces';

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
      (click)="deliteGrope(group.id.S)"
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
          font-weight: 700;
        }
      }
    `,
  ],
})
export class GrupCardComponent {
  isMygroupe = false;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.currentuser === this.group.createdBy.S) {
      this.isMygroupe = true;
    }
  }

  navigateToDetails(groupId: string) {
    this.router.navigate(['/group', groupId]);
  }

  @Input() group!: GroupItem;
  @Input() currentuser!: string;

  deliteGrope(id: string) {
    console.log(id);
    console.log('implement delite groupe');
  }

  openGroupe(id: string) {
    console.log(id);
    console.log('implement open groupe');
  }
}
