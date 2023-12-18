import { combineReducers } from '@ngrx/store';
import { GroupState, groupReducer } from './reducers/group.reducer';
import { UserState, userReducer } from './reducers/user.reducer';

export interface AppState {
  groups: GroupState;
  users: UserState;
}

export const rootReducer = combineReducers({
  groups: groupReducer,
  users: userReducer,
});
