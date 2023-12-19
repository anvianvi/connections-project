import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../state.model';
import { UserState } from '../reducers/user.reducer';
import {
  UserItem,
  ConversationsItem,
  MyCompanionsItem,
} from 'src/app/shared/interfaces/interfaces';

export const selectUsersState = createFeatureSelector<AppState, UserState>(
  'users'
);

export const selectUsers = createSelector(
  selectUsersState,
  (state) => state.users
);

export const selectUserById = (id: string) =>
  createSelector(selectUsers, (users) =>
    users.find((user) => user.uid.S === id)
  );

export const selectConversations = createSelector(
  selectUsersState,
  (state) => state.conversations
);

export const selectCompanions = createSelector(
  selectUsersState,
  (state) => state.companions
);

export const selectMyCompanions = (currentUserID: string) =>
  createSelector(
    selectUsers,
    selectConversations,
    (users: UserItem[], conversations: ConversationsItem[]) => {
      return users
        .map((user: UserItem) => {
          const conversation = conversations.find(
            (conv: ConversationsItem) => conv.companionID.S === user.uid.S
          );
          return {
            conversationId: { S: conversation?.id.S || null },
            companionID: { S: user.uid.S },
            userName: { S: user.name.S },
          } as MyCompanionsItem;
        })
        .filter((item) => item.companionID.S !== currentUserID);
    }
  );
