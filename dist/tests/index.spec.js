import { test } from "@japa/runner";
import { faker } from "@faker-js/faker";
import { Client } from "../src/client.js";
test.group("Testing all endpoints", () => {
    const ake = new Client({
        authGuard: "token",
        url: "http://localhost:3333",
    });
    let token;
    /**
     * Auth endpoints
     */
    test("/register", async ({ assert }) => {
        const response = await ake.auth.register({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            description: faker.lorem.sentence(),
            password: "gh8A*ghgh",
        });
        assert.containsSubset(response, { status: "Created" });
    });
    test("/login", async ({ assert }) => {
        const response = await ake.auth.login({
            email: "marin@ake-app.com",
            password: "secret",
        });
        assert.containsSubset(response, { status: "Created" });
        //Saving token for other requests
        token = response.data.token.token;
    });
    test("/logout", async ({ assert }) => {
        const response = await ake.auth.logout({
            token: token,
        });
        assert.containsSubset(response, { status: "Ok" });
    });
    test("/user/token", async ({ assert }) => {
        const response = await ake.auth.socketToken({
            token: token,
        });
        assert.containsSubset(response, { status: "Created" });
    });
    /**
     * Conversation endpoints
     */
    test("/conversation/new", async ({ assert }) => {
        const response = await ake.conversation.new({
            participantsWithoutCreator: ["louis#1", "ake#1"],
            content: faker.lorem.sentence(),
            token: token,
        });
        assert.containsSubset(response, { status: "Created" });
    });
    test("/conversations/get", async ({ assert }) => {
        const response = await ake.conversation.get({
            offset: 0,
            token: token,
        });
        assert.containsSubset(response, { status: "Ok" });
    });
    test("/conversations/search", async ({ assert }) => {
        const response = await ake.conversation.search({
            offset: 0,
            query: "louis",
            token: token,
        });
        assert.containsSubset(response, { status: "Ok" });
    });
    /**
     * Message endpoints
     */
    test("/message/send", async ({ assert }) => {
        const response = await ake.message.send({
            convId: 1,
            content: "Deuxième message de la conversation",
            token: token,
        });
        assert.containsSubset(response, { status: "Created" });
    });
    test("/message/get", async ({ assert }) => {
        const response = await ake.message.get({
            convId: 1,
            offset: 0,
            token: token,
        });
        assert.containsSubset(response, { status: "Ok" });
    });
    test("/message/read", async ({ assert }) => {
        const messages = await ake.message.get({
            convId: 1,
            offset: 0,
            token: token,
        });
        const msgId = messages.data[0].id;
        const response = await ake.message.read({
            msgId,
            token,
        });
        assert.containsSubset(response, { status: "Created" });
    });
    /**
     * User endpoints
     */
    test("/user/account/informations", async ({ assert }) => {
        const informations = await ake.user.accountInformations({
            userId: 1,
            token: token,
        });
        console.log(informations);
        assert.containsSubset(informations, { status: "Ok" });
    });
    test("/user/description", async ({ assert }) => {
        const response = await ake.user.changeDescription({
            description: "Editing description...",
            token: token,
        });
        assert.containsSubset(response, { status: "Created" });
    });
    test("/user/username", async ({ assert }) => {
        const response = await ake.user.changeUsername({
            username: "marinbis",
            token: token,
        });
        assert.containsSubset(response, { status: "Created" });
        /*     await ake.user.changeUsername({
          username: "marin",
          token: token
        }) */
    });
});
