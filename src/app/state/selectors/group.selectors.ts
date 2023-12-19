import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupState } from '../reducers/group.reducer';
import { AppState } from '../state.model';

export const selectGroupState = createFeatureSelector<AppState, GroupState>(
  'groups'
);

export const selectGroups = createSelector(
  selectGroupState,
  (state) => state.groups
);
