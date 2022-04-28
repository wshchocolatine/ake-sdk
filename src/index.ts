class AkeSdk {
    constructor(
        url: string, 
        authGuard: 'session' | 'token'
    ) {
        this.url = url
        this.authGuard = authGuard
    }

    public url: string

    public authGuard: string

    public auth

    public conversation 

    public message 

    public user 
}