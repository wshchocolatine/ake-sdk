import got from "got"
import { version as packageVersion } from "../package.json"
// const axios = require('axios').default


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

    constructor(
        authGuard: 'session' | 'token', 
        url: string
    ) {
        this.#authGuard = authGuard
        this.#url = url
        this.#userAgent = `ake-sdk/${packageVersion}`
    }


    /**
     * Sends a request 
     * 
     * @param path 
     * @param method
     * @param params
     * @param body
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
            throw this.buildRequestError(e.response.statusCode, e.response.body) 
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