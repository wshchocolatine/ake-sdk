import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import { Client } from '../src/client.js'

test.group('Testing all endpoints', () => {
    const ake = new Client({
        authGuard: 'token', 
        url: 'http://localhost:3333'
    })

    let token;

    
    /**
     * Auth endpoints
     */

    test('/register', async() => {
        const response = await ake.auth.register({
            username: faker.internet.userName(), 
            email: faker.internet.email(), 
            description: faker.lorem.sentence(), 
            password: 'gh8A*ghgh'
        })

        console.log(response)
    })

    test('/login', async() => {
        const response = await ake.auth.login({
            email: 'marin@ake-app.com', 
            password: 'secret'
        })

        console.log(response)

        //Saving token for other requests
        token = response.data.token.token
    })
})