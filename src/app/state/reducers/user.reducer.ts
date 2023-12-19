import { Action, createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import {
  ConversationsItem,
  MyCompanionsItem,
  UserItem,
} from 'src/app/shared/interfaces/interfaces';

export interface UserState {
  users: UserItem[];
  conversations: ConversationsItem[];
  companions: MyCompanionsItem[];
}

export const initialUserState: UserState = {
  users: [],
  conversations: [],
  companions: [],
};

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.updateUsersList, (state, { users }) => {
    return {
      ...state,
      users: users,
    };
  })
);
