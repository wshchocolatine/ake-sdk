type Endpoint = {
  method: "GET" | "POST";
  path: string;
  auth: boolean;
};

type Id = string | number;

type BasicError = {
  message: string;
};

type ValidationError = {
  message: string;
  rule: string;
  field: string;
};

type ConversationItem = {
  id: Id;
  last_msg_content: string;
  last_msg_author: Id;
  last_msg_read: boolean;
  created_at: string;
  updated_at: string;
  participants: Array<{
    user_id: Id;
    username: string;
  }>;
};

type MessageItem = {
  id: Id;
  author: Id;
  conversation_id: Id;
  content: string;
  read: boolean;
  created_at: string;
};

type UserSerializedItem = {
  id: Id; 
  username: string;
  tag: Id;
  description: string;
  email?: string; 
}

type username = string 
type tag = number 
type usernameAndTag = `${username}#${tag}`

/**
 * Auth endpoints
 */

/**
 * Register
 */

export const register: Endpoint = {
  method: "POST",
  path: "/register",
  auth: false,
};

export type RegisterParameters = {
  username: string;
  email: string;
  password: string;
  description: string;
};

export type RegisterResponse = {
  status:
    | "Created"
    | "Bad Request"
    | "Conflict"
    | "Precondition Failed"
    | "Internal Server Error";
  errors?: BasicError | ValidationError;
  data?: {
    token: {
      token: string;
      type: "Bearer";
      expiresAt: string;
    };
  };
};

/**
 * Login
 */

export const login: Endpoint = {
  method: "POST",
  path: "/login",
  auth: false,
};

export type LoginParameters = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status:
    | "Created"
    | "Bad Request"
    | "Unauthorized"
    | "Internal Server Error";
  errors?: BasicError | ValidationError;
  data?: {
    token: {
      type: "bearer";
      token: string;
      expiresAt: string;
    };
  };
};

/**
 * Logout
 */

export const logout: Endpoint = {
  method: "GET",
  path: "/logout",
  auth: true,
};

export type LogoutParameters = {
  token?: string;
};

export type LogoutResponse = {
  status: 
    | "Ok" 
    | "Unauthorized" 
    | "Internal Server Error";
  errors?: BasicError;
};

/**
 * Socket token
 */

export const socketToken: Endpoint = {
  method: "GET",
  path: "/user/token",
  auth: true,
};

export type SocketTokenParameters = {
  token?: string;
};

export type SocketTokenResponse = {
  status: 
    | "Ok" 
    | "Unauthorized" 
    | "Internal Server Error";
  data?: {
    token: string;
    expiresAt: string;
  };
  errors?: BasicError;
};

/**
 * Conversation endpoints
 */

/**
 * New conversation
 */

export const newConversation: Endpoint = {
  path: "/conversations/new",
  method: "POST",
  auth: true,
};

export type NewConversationParameters = {
  participantsWithoutCreator: Array<usernameAndTag>;
  content: string;
  token?: string;
};

export type NewConversationResponse = {
  status: 
    | "Created" 
    | "Bad Request"
    | "Unauthorized"  
    | "Conflict"
    | "Internal Server Error";
  errors?: BasicError | ValidationError;
};

/**
 * Get conversation
 */

export const getConversation: Endpoint = {
  method: "GET",
  path: "/conversations/get",
  auth: true,
};

export type GetConversationParameters = {
  offset: number;
  token?: string;
};

export type GetConversationResponse = {
  status: 
    | "Ok" 
    | "Bad Request" 
    | "Unauthorized" 
    | "Internal Server Error";
  data?: Array<ConversationItem>;
  errors?: BasicError;
};

/**
 * Search conversation
 */

export const searchConversation: Endpoint = {
  path: "/conversations/search",
  method: "GET",
  auth: true,
};

export type SearchConversationParameters = {
  offset: number;
  query: string;
  token?: string;
};

export type SearchConversationResponse = {
  status:
    | "Created" 
    | "Bad Request" 
    | "Unauthorized" 
    | "Internal Server Error";
  data?: Array<ConversationItem>;
  errors?: BasicError;
};

/**
 * Message endpoints
 */

/**
 * Send a message
 */

export const sendMessage: Endpoint = {
  path: "/message/send",
  method: "POST",
  auth: true,
};

export type SendMessageParameters = {
  convId: number;
  content: string;
  token?: string;
};

export type SendMessageResponse = {
  status: 
    | "Created" 
    | "Bad Request" 
    | "Unauthorized" 
    | "Internal Server Error";
  errors?: BasicError | ValidationError;
};

/**
 * Get messages
 */

export const getMessage: Endpoint = {
  path: "/message/get",
  method: "GET",
  auth: true,
};

export type GetMessageParameters = {
  convId: Id;
  offset: number;
  token?: string;
};

export type GetMessageResponse = {
  status: 
    | "Ok" 
    | "Bad Request" 
    | "Unauthorized" 
    | "Internal Server Error";
  data?: Array<MessageItem>;
  errors?: BasicError;
};

/**
 * Read a message
 */

export const readMessage: Endpoint = {
  path: "/message/read",
  method: "GET",
  auth: true,
};

export type ReadMessageParameters = {
  msgId: Id;
  token?: string;
};

export type ReadMessageResponse = {
  status: 
    | "Created" 
    | "Bad Request" 
    | "Unauthorized" 
    | "Internal Server Error";
  errors?: BasicError;
};


/**
 * User endpoints
 */

/**
 * User account
 */

export const accountInformations: Endpoint = {
  path: '/user/account/informations',
  method: 'GET',
  auth: true
};

export type AccountInformationsParameters = {
  userId?: number;
  token?: string;
};

export type AccountInformationsResponse = {
  status: 
    | "Ok"
    | "Unauthorized"
    | "Internal Server Error"; 
  data?: UserSerializedItem;
  errors?: BasicError;
};

/**
 * Change Description
 */

export const changeDescription: Endpoint = {
  path: "/user/description", 
  method: "POST", 
  auth: true
}; 

export type ChangeDescriptionParameters = {
  description: string;
  token?: string;
};

export type ChangeDescriptionResponse = {
  status: 
    | "Created"
    | "Bad Request"
    | "Unauthorized"
    | "Internal Server Error";
  errors?: BasicError | ValidationError;
};

/**
 * Change Username
 */

export const changeUsername: Endpoint = {
  path: "/user/username", 
  method: "POST", 
  auth: true
};

export type ChangeUsernameParameters = {
  username: string;
  token?: string;
};

export type ChangeUsernameResponse = {
  status:
    | "Created"
    | "Bad Request"
    | "Unauthorized"
    | "Internal Server Error"; 
  errors?: BasicError | ValidationError;
};