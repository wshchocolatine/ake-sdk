type Endpoint = {
    method: 'GET' | 'POST', 
    path: string, 
    auth: boolean
}

/**
 * Auth endpoints
 */

/**
 * Register
 */

export const register: Endpoint = {
    method: 'POST', 
    path: '/register', 
    auth: false
}

export type RegisterParameters = {
    username: string, 
    email: string, 
    password: string, 
    description: string
}

export type RegisterResponse = {
    status: 
        | 'Created' 
        | 'Bad Request'
        | 'Conflict'
        | 'Precondition Failed'
        | 'Internal Server Error', 
    errors?: {
        message: string, 
        rule?: string, 
        field?: string
    }, 
    data?: {
        token: {
            token: string, 
            type: 'Bearer', 
            expiresAt: string
        }
    }
}


/**
 * Login
 */

export const login: Endpoint = {
    method: 'POST', 
    path: '/login', 
    auth: false
}

export type LoginParameters = {
    email: string, 
    password: string
}

export type LoginResponse = {
    status: 
        | 'Created'
        | 'Bad Request'
        | 'Unauthorized'
        | 'Conflict'
        | 'Internal Server Error', 
    errors?: {
        message: string, 
        rule?: string, 
        field?: string
    }, 
    data?: {
        token: {
            type: 'bearer', 
            token: string, 
            expiresAt: string
        }
    }
}


/**
 * Logout
 */

export const logout: Endpoint = {
    method: 'GET', 
    path: '/logout', 
    auth: true
}

export type LogoutParameters = {
    token?: string
}

export type LogoutResponse = {
    status:
        | 'Created'
        | 'Unauthorized'
        | 'Internal Server Error', 
    errors?: {
        message: string, 
    }, 
}


/**
 * Socket token
 */

export const socketToken: Endpoint = {
    method: 'GET', 
    path: '/user/token', 
    auth: true
}

export type SocketTokenParameters = {
    token?: string
}

export type SocketTokenResponse = {
    status: 
        | 'Ok'
        | 'Unauthorized'
        | 'Internal Server Error', 
    data?: {
        token: string, 
        expiresAt: string
    }, 
    errors?: {
        message: string
    }
}