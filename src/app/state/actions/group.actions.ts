import { createAction, props } from '@ngrx/store';
import { GroupItem } from 'src/app/shared/interfaces/interfaces';

export const updateGroupsList = createAction(
  '[Groups] Update Groups List',
  props<{ groups: GroupItem[] }>()
);

export const addCustomGroup = createAction(
  '[Groups] Add Group To List',
  props<{ group: GroupItem }>()
);

export const remuveGroupe = createAction(
  '[Groups] Delete Group',
  props<{ groupeId: string }>()
);
