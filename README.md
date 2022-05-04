# Ake SDK

This is the SDK of Ake, an open source messenger. 

<p align="center"><img src="./assets/logo.png" width="250"></p>

For more explanations about this projet, check [here](https://github.com/wshchocolatine/ake-api#readme/)

## Goals of the SDK

The main goal of this project is to develop the use of Ake by facilitating the handling of the API. Each one can indeed build its version "front-end" of Ake by using the API which is opened to all. 

So do not hesitate to launch your own messaging application built on Ake with this SDK. 

## Installation 

```
npm install ake-sdk
```

## Usage

First initialize the client with the location of the Ake Server (`url`) and your favorite authentication guard (`authGuard`). 

```js
import { Client } from 'ake-sdk'

const ake = new Client({
	url: 'http://localhost:3333', 
	authGuard: 'session' | 'token'
})
```

If  your `authGuard` is set to "token", then, if you call a method that requires authentication, you must pass in its parameters the authentication token. 

We remind you that all ake's api routes are documented [here](https://www.notion.so/wshchocolatine/Routes-29e68974864a4f178a587eac4d677854)

Summary : 

1. [Auth](#auth)
2. [Conversations](#conversations)
3. [Message](#message)
4. [User](#user)

### Auth 

##### `/register`

```typescript
await ake.auth.register({
	username: string, 
	password: string, 
	email: string, 
	description: string
})
```

##### `/login`

```typescript 
await ake.auth.login({
	email: string, 
	password: string
})
```

##### `/logout`

```typescript
await ake.auth.logout({
	token?: string
})
```

##### `/auth/socket/token`

```typescript
await ake.auth.socketToken({
	token?: string
})
```

### Conversations 

##### `/conversations/new`

```typescript
await ake.conversations.new({
	participantsWithoutCreator: Array<string>, 
	content: string, 
	token?: string	
})
```

##### `/conversations/get`

```typescript
await ake.conversations.get({
	offset: number, 
	token?: string
})
```

##### `/conversations/search`

```typescript
await ake.conversations.search({
	offset: number, 
	query: string, 
	token?: string
})
```

### Message 

##### `/message/new`

```typescript
await ake.message.new({
	convId: string, 
	content: string, 
	token?: string
})
```

##### `/message/get`

```typescript
await ake.message.get({
	convId: string, 
	offset: number, 
	token?: string
})
```

##### `/message/read`

```typescript
await ake.message.read({
	msgId: string, 
	token?: string
})
```

### User 

Coming...

