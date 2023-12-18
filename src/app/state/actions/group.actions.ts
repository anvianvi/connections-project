import { createAction, props } from '@ngrx/store';
import { GroupItem } from 'src/app/shared/interfaces/interfaces';

export const updateGroupsList = createAction(
  '[Groups] Update Groups List',
  props<{ groups: GroupItem[] }>()
);
