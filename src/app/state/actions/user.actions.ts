import { createAction, props } from '@ngrx/store';
import {
  ConversationsItem,
  MyCompanionsItem,
  UserItem,
} from 'src/app/shared/interfaces/interfaces';

export const updateUsersList = createAction(
  '[Users] Update Users List',
  props<{ users: UserItem[] }>()
);

export const updateConversationsList = createAction(
  '[Conversations] Update Conversations List',
  props<{ conversations: ConversationsItem[] }>()
);

export const addNewConversation = createAction(
  '[Conversations] Add Conversation To List',
  props<{ conversation: ConversationsItem }>()
);

export const remuveConversation = createAction(
  '[Conversation] Delete Conversation',
  props<{ conversationID: string }>()
);


export const updateCompanionsList = createAction(
  '[Companions] Update Companions List',
  props<{ companions: MyCompanionsItem[] }>()
);
