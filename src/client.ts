import got from "got"
import {
    register, RegisterParameters, RegisterResponse, 
    login, LoginParameters, LoginResponse, 
    logout, LogoutParameters, LogoutResponse, 
    socketToken, SocketTokenParameters, SocketTokenResponse, 
    newConversation, NewConversationParameters, NewConversationResponse, 
    getConversation, GetConversationParameters, GetConversationResponse, 
    searchConversation, SearchConversationParameters, SearchConversationResponse
} from "./api-endpoints.js"
// const axios = require('axios').default


type ClientParameters = {
    authGuard: 'session' | 'token', 
    url: string
}

export type RequestParameters = {
    path: string, 
    method: 'GET' | 'POST', 
    auth: boolean, 
    token?: string,
    params?: Record<string, unknown>,
    body?: Record<string, unknown>
}

export class Client {
    #authGuard: 'session' | 'token' 
    #url: string
    #userAgent: string

    constructor(args: ClientParameters) {
        this.#authGuard = args.authGuard
        this.#url = args.url
        this.#userAgent = `ake-sdk@1.0.0}`
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

    public async request({
        path, 
        method, 
        auth,
        token,
        params, 
        body
    }: RequestParameters) {

        //Creating the url and appending existing params
        const url = new URL(`${this.#url}${path}`)

        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value))
                }
            }
        }

        //Setting headers 
        const requestHeaders = auth === true && this.#authGuard === 'token'
            ? {
                ...this.authHeader(token),
                'userAgent': this.#userAgent, 
            }
            : {
                'userAgent': this.#userAgent
            }

        try {
            //Making the request (if body undefined, we don't send it)
            const response =  
                body === undefined 
                ? await got({
                    url,
                    method, 
                    headers: requestHeaders
                })
                : await got({
                    url, 
                    method, 
                    headers: requestHeaders,
                    json: body
                })

            const statusCode = response.statusCode
            console.log(this.buildRequestSuccess(statusCode))

            const responseBody = response.body

            return JSON.parse(responseBody)
        } catch(e) {
            if (e.code === 'ECONNREFUSED') {
                return {
                    status: 'Error', 
                    message: 'ECONNREFUSED'
                }
            }
            return JSON.parse(e.response.body)
        }    
    }


    /**
     * Api endpoints (auth, conversation, message, user)
     */

    /**
     * Auth endpoints
     */

    public readonly auth = {
        /**
         * Register to Ake 
         */

        register: (
            args: RegisterParameters
        ): Promise<RegisterResponse> =>  {
            return this.request({
                path: register.path, 
                method: register.method, 
                auth: register.auth, 
                params: this.#authGuard === 'token'
                    ? { token: true }
                    : undefined, 
                body: args
            })
        },


        /**
         * Login to Ake 
         */

        login: (
            args: LoginParameters
        ): Promise<LoginResponse> => {
            return this.request({
                path: login.path, 
                method: login.method, 
                auth: login.auth, 
                params: this.#authGuard === 'token'
                    ? { token: true }
                    : undefined, 
                body: args
            })
        },


        /**
         * Logout to Ake 
         */

        logout: (
            args: LogoutParameters
        ): Promise<LogoutResponse> => {
            return this.request({
                path: logout.path, 
                method: logout.method, 
                auth: logout.auth, 
                token: args.token
            })
        },


        /**
         * Socket token
         */

        socketToken: (
            args: SocketTokenParameters
        ): Promise<SocketTokenResponse> => {
            return this.request({
                path: socketToken.path, 
                method: socketToken.method, 
                auth: socketToken.auth, 
                token: args.token
            })
        }
    }


    /**
     * Conversation endpoints
     */

    public readonly conversation = {
        /**
         * Create a new conversation
         */

        new: (
            args: NewConversationParameters
        ): Promise<NewConversationResponse> => {
            const body = {
                participantsWithoutCreator: args.participantsWithoutCreator, 
                content: args.content
            }

            return this.request({
                path: newConversation.path, 
                method: newConversation.method, 
                auth: newConversation.auth, 
                body, 
                token: args.token
            })
        },


        /**
         * Get last 12 conversations
         */

        get: (
            args: GetConversationParameters
        ): Promise<GetConversationResponse> => {
            const params = {
                offset: args.offset
            }

            return this.request({
                path: getConversation.path, 
                method: getConversation.method, 
                auth: getConversation.auth, 
                params, 
                token: args.token
            })
        },


        /**
         * Search conversation by :query?
         */

        search: (
            args: SearchConversationParameters
        ): Promise<SearchConversationResponse> => {
            const params = {
                offset: args.offset, 
                query: args.query
            }

            return this.request({
                path: searchConversation.path, 
                method: searchConversation.method, 
                auth: searchConversation.auth, 
                params, 
                token: args.token
            })
        }
    }


    /**
     * Generate an error
     * 
     * @param statusRequest
     * @param bodyText
     */

    private buildRequestError(
        statusRequest: number, 
        bodyText: string, 
    ) {
        const errors = JSON.parse(bodyText)
        return {
            status: 'Error', 
            message: 'Request has failed',
            statusRequest, 
            errors, 
        }
    }


    /**
     * Returning for success requests
     * 
     * @param statusRequest
     * @param bodyText
     */

    private buildRequestSuccess(
        statusRequest: number, 
    ) {

        return {
            status: 'Success', 
            message: 'Request has been successfully attempted',
            statusRequest
        }
    }


    /**
     * Returning an auth header
     */

    private authHeader(token: string): Record<string, string> {
        return {
            'Authorization': `Bearer ${token}`
        }
    }
}