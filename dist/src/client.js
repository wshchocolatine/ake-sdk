import got from "got";
import { register, login, logout, socketToken, newConversation, getConversation, searchConversation, sendMessage, getMessage, readMessage, accountInformations, changeDescription, changeUsername, } from "./api-endpoints.js";
export class Client {
    #authGuard;
    #url;
    #userAgent;
    constructor(args) {
        this.#authGuard = args.authGuard;
        this.#url = args.url;
        this.#userAgent = `ake-sdk@1.0.0}`;
    }
    /**
     * Sends a request
     *
     * @param path
     * @param method
     * @param {boolean} auth - Does the request needs auth ?
     * @param {string} [token] - Token if the request needs authentication by token
     * @param {object} [params] - Optionnals params of the request
     * @param {object} [body] - Optionnal body of the request
     */
    async request({ path, method, auth, token, params, body, }) {
        //Creating the url and appending existing params
        const url = new URL(`${this.#url}${path}`);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            }
        }
        //Setting headers
        const requestHeaders = auth === true && this.#authGuard === "token"
            ? {
                ...this.authHeader(token),
                userAgent: this.#userAgent,
            }
            : {
                userAgent: this.#userAgent,
            };
        try {
            //Making the request (if body undefined, we don't send it)
            const response = body === undefined
                ? await got({
                    url,
                    method,
                    headers: requestHeaders,
                })
                : await got({
                    url,
                    method,
                    headers: requestHeaders,
                    json: body,
                });
            const statusCode = response.statusCode;
            console.log(this.buildRequestSuccess(statusCode));
            const responseBody = response.body;
            return JSON.parse(responseBody);
        }
        catch (e) {
            if (e.code === "ECONNREFUSED") {
                return {
                    status: "Error",
                    message: "ECONNREFUSED",
                };
            }
            if (e.response.statusCode === 404) {
                return {
                    status: "Error",
                    statusCode: 404,
                    message: "This route doesn't exists on this Ake server",
                };
            }
            return JSON.parse(e.response.body);
        }
    }
    /**
     * Api endpoints (auth, conversation, message, user)
     */
    /**
     * Auth endpoints
     */
    auth = {
        /**
         * Register to Ake
         */
        register: (args) => {
            return this.request({
                path: register.path,
                method: register.method,
                auth: register.auth,
                params: this.#authGuard === "token" ? { token: true } : undefined,
                body: args,
            });
        },
        /**
         * Login to Ake
         */
        login: (args) => {
            return this.request({
                path: login.path,
                method: login.method,
                auth: login.auth,
                params: this.#authGuard === "token" ? { token: true } : undefined,
                body: args,
            });
        },
        /**
         * Logout to Ake
         */
        logout: (args) => {
            return this.request({
                path: logout.path,
                method: logout.method,
                auth: logout.auth,
                token: args.token,
            });
        },
        /**
         * Socket token
         */
        socketToken: (args) => {
            return this.request({
                path: socketToken.path,
                method: socketToken.method,
                auth: socketToken.auth,
                token: args.token,
            });
        },
    };
    /**
     * Conversation endpoints
     */
    conversation = {
        /**
         * Create a new conversation
         */
        new: (args) => {
            const body = {
                participantsWithoutCreator: args.participantsWithoutCreator,
                content: args.content,
            };
            return this.request({
                path: newConversation.path,
                method: newConversation.method,
                auth: newConversation.auth,
                body,
                token: args.token,
            });
        },
        /**
         * Get last 12 conversations
         */
        get: (args) => {
            const params = {
                offset: args.offset,
            };
            return this.request({
                path: getConversation.path,
                method: getConversation.method,
                auth: getConversation.auth,
                params,
                token: args.token,
            });
        },
        /**
         * Search conversation by :query?
         */
        search: (args) => {
            const params = {
                offset: args.offset,
                query: args.query,
            };
            return this.request({
                path: searchConversation.path,
                method: searchConversation.method,
                auth: searchConversation.auth,
                params,
                token: args.token,
            });
        },
    };
    /**
     * Message endpoints
     */
    message = {
        /**
         * Send a message
         */
        send: (args) => {
            const body = {
                convId: args.convId,
                content: args.content,
            };
            return this.request({
                path: sendMessage.path,
                method: sendMessage.method,
                auth: sendMessage.auth,
                body,
                token: args.token,
            });
        },
        /**
         * Get message of a conv
         */
        get: (args) => {
            const params = {
                convId: args.convId,
                offset: args.offset,
            };
            console.log(params);
            return this.request({
                path: getMessage.path,
                method: getMessage.method,
                auth: getMessage.auth,
                params,
                token: args.token,
            });
        },
        /**
         * Mark a message as read
         */
        read: (args) => {
            const params = {
                msgId: args.msgId,
            };
            return this.request({
                path: readMessage.path,
                method: readMessage.method,
                auth: readMessage.auth,
                params,
                token: args.token,
            });
        },
    };
    /**
     * User endpoints
     */
    user = {
        /**
         * Informations about your account
         */
        accountInformations: (args) => {
            return this.request({
                path: accountInformations.path,
                method: accountInformations.method,
                auth: accountInformations.auth,
                params: args.userId ? { userId: args.userId } : undefined,
                token: args.token,
            });
        },
        /**
         * Change user description
         */
        changeDescription: (args) => {
            return this.request({
                path: changeDescription.path,
                method: changeDescription.method,
                auth: changeDescription.auth,
                body: { description: args.description },
                token: args.token,
            });
        },
        /**
         * Change user username
         */
        changeUsername: (args) => {
            return this.request({
                path: changeUsername.path,
                method: changeUsername.method,
                auth: changeUsername.auth,
                body: { username: args.username },
                token: args.token,
            });
        },
    };
    /**
     * Generate an error
     *
     * @param statusRequest
     * @param bodyText
     */
    buildRequestError(statusRequest, bodyText) {
        const errors = JSON.parse(bodyText);
        return {
            status: "Error",
            message: "Request has failed",
            statusRequest,
            errors,
        };
    }
    /**
     * Returning for success requests
     *
     * @param statusRequest
     * @param bodyText
     */
    buildRequestSuccess(statusRequest) {
        return {
            status: "Success",
            message: "Request has been successfully attempted",
            statusRequest,
        };
    }
    /**
     * Returning an auth header
     */
    authHeader(token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
}
