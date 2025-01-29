const { controller } = require("./controller")
const { DBConector } = require("../../lib/interfaces/dbConector");
const { JWTValidator } = require("../../lib/interfaces/jwtValidator.js");

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
const dummyJWTNotPass = new DummyJWTNotPass();

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

    await expect(controller(data, storage, dummyJWTPass)).rejects.toThrow('id is required');
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

    await expect(controller(data, storage, dummyJWTPass)).rejects.toThrow('content is required');
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

    await expect(controller(data, storage, dummyJWTPass)).rejects.toThrow('id is required');
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

    await expect(controller(data, storage, dummyJWTNotPass)).rejects.toThrow('JWT not valid');
})