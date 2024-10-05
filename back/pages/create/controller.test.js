const { controller } = require("./controller")
const { DBConector } = require("../lib/interfaces/dbConector");
const { JWTValidator } = require("../lib/interfaces/jwtValidator");

const DummyDB = class DummyDB extends DBConector{
    async create(data){
        return data
    }
}
const storage = new DummyDB();

class DummyJWTPass extends JWTValidator{
    async validate(token){return}
}

class DummyJWTNotPass extends JWTValidator{
    async validate(token){
        throw new Error("JWT not valid")
    }
}
const dummyJWTPass = new DummyJWTPass();
const dummyJWTNotPass = new DummyJWTPass();

test('receives data, and return the data', async () => {

    const data = {
        head:{
            jwtToken: "asd",
        },
        body: {
            id: "page1",
            content: "hola mundo"
        }
    }

    const result = {
        id: "page1",
        content: "hola mundo"
    }

    expect(await controller(data, storage, dummyJWTPass)).toStrictEqual(result)
})

test('receives incomplete data, throws error', async () => {

    const data = {
        head:{
            jwtToken: "asd",
        },
        body: {
            content: "hola mundo"
        }
    }

    try {
        await controller(data, storage, dummyJWTPass);
    } catch (error) {
        expect(error.message).toBe('id is required');
    }
})

test('receives incomplete data, throws error', async () => {

    const data = {
        head:{
            jwtToken: "asd",
        },
        body: {
            id: "page1",
        }
    }

    try {
        await controller(data, storage, dummyJWTPass);
    } catch (error) {
        expect(error.message).toBe('content is required');
    }
})

test('receives incomplete data, throws error', async () => {

    const data = {
        head:{
            jwtToken: "asd",
        },
        body: {
            id: "",
            content: "hola mundo"
        }
    }

    try {
        await controller(data, storage, dummyJWTPass);
    } catch (error) {
        expect(error.message).toBe('id is required');
    }
})

test('jwt token not valid', async () => {

    const data = {
        head:{
            jwtToken: "asd",
        },
        body: {
            id: "aa",
            content: "hola mundo"
        }
    }

    try {
        await controller(data, storage, dummyJWTNotPass);
    } catch (error) {
        expect(error.message).toBe('JWT not valid');
    }
})