import { createReducer, on } from '@ngrx/store';
import * as GroupActions from '../actions/group.actions';
import { GroupItem } from 'src/app/shared/interfaces/interfaces';

export interface GroupState {
  groups: GroupItem[];
}

export const initialGroupState: GroupState = {
  groups: [],
};

export const groupReducer = createReducer(
  initialGroupState,
  on(GroupActions.updateGroupsList, (state, { groups }) => {
    return {
      ...state,
      groups: groups,
    };
  }),
  on(GroupActions.addCustomGroup, (state, { group }) => {
    return {
      ...state,
      groups: [group, ...state.groups],
    };
  }),
  on(GroupActions.remuveGroupe, (state, { groupeId }) => ({
    ...state,
    videoItems: state.groups.filter((group) => group.id.S !== groupeId),
  }))
);
