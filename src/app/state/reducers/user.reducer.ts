// user.reducer.ts
import { Action, createReducer, on } from '@ngrx/store';
// import * as UserActions from './actions/user.actions';

export interface User {
  // Define user properties
}

export interface UserState {
  users: User[];
}

export const initialUserState: UserState = {
  users: [],
};

export const userReducer = createReducer(
  initialUserState
  // Define your user-related actions and handlers using the 'on' function from '@ngrx/store'
);
