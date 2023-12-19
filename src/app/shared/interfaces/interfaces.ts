export interface NewUser {
  email: string;
  name: string;
  password: string;
}

export interface ServerResponse {
  status: number;
  error?: ErrorResponse;
}

export interface ErrorResponse {
  type: string;
  message: string;
}

export interface LoginResponse {
  token: string;
  uid: string;
  type: string;
  message: string;
}

export interface GetProfileResponse {
  email: { S: string };
  name: { S: string };
  uid: { S: string };
  createdAt: { S: string };
}

export interface GetGroupListResponse {
  status: number;
  Count: number;
  Items: GroupItem[];
  error?: ErrorResponse;
}

export interface GroupItem {
  id: { S: string };
  name: { S: string };
  createdAt: { S: string };
  createdBy: { S: string };
}
export interface PostGropeResponse {
  status: number;
  groupID: string;
}
export interface GetUserListResponse {
  status: number;
  Count: number;
  Items: UserItem[];
  error?: ErrorResponse;
}
export interface UserItem {
  name: { S: string };
  uid: { S: string };
}

export interface GetConversationsListResponse {
  status: number;
  Count: number;
  Items: ConversationsItem[];
  error?: ErrorResponse;
}
export interface ConversationsItem {
  id: { S: string };
  companionID: { S: string };
}
export interface CreateConversationResponse {
  status: number;
  conversationID: string;
}
export interface MyCompanionsItem {
  convercationId?: { S: string };
  companionID: { S: string };
  userName: { S: string };
}
