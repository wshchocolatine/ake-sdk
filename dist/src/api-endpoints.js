/**
 * Auth endpoints
 */
/**
 * Register
 */
export const register = {
    method: "POST",
    path: "/register",
    auth: false,
};
/**
 * Login
 */
export const login = {
    method: "POST",
    path: "/login",
    auth: false,
};
/**
 * Logout
 */
export const logout = {
    method: "GET",
    path: "/logout",
    auth: true,
};
/**
 * Socket token
 */
export const socketToken = {
    method: "GET",
    path: "/user/token",
    auth: true,
};
/**
 * Conversation endpoints
 */
/**
 * New conversation
 */
export const newConversation = {
    path: "/conversations/new",
    method: "POST",
    auth: true,
};
/**
 * Get conversation
 */
export const getConversation = {
    method: "GET",
    path: "/conversations/get",
    auth: true,
};
/**
 * Search conversation
 */
export const searchConversation = {
    path: "/conversations/search",
    method: "GET",
    auth: true,
};
/**
 * Message endpoints
 */
/**
 * Send a message
 */
export const sendMessage = {
    path: "/message/send",
    method: "POST",
    auth: true,
};
/**
 * Get messages
 */
export const getMessage = {
    path: "/message/get",
    method: "GET",
    auth: true,
};
/**
 * Read a message
 */
export const readMessage = {
    path: "/message/read",
    method: "GET",
    auth: true,
};
/**
 * User endpoints
 */
/**
 * User account
 */
export const accountInformations = {
    path: '/user/account/informations',
    method: 'GET',
    auth: true
};
/**
 * Change Description
 */
export const changeDescription = {
    path: "/user/description",
    method: "POST",
    auth: true
};
/**
 * Change Username
 */
export const changeUsername = {
    path: "/user/username",
    method: "POST",
    auth: true
};
