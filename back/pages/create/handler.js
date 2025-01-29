const { DynamoStorage } = require("../../lib/storage/dynamoStorage.js");
const { LoginJWT } = require("../../lib/jwt/loginjwt.js");
const { controller } = require("./controller.js");

const storage = new DynamoStorage();
const jwtvalidator = new LoginJWT();

export const handler = async (event) => {
    // TODO implement
    const {body,headers} = event;
    const data = JSON.parse(body);
    try{
        const res = await controller(data, storage, jwtvalidator)
        return {
            statusCode: 200,
            body: JSON.stringify(res),
        };
    }catch(e){
        // Handle known 'Item already exists' error
        if (e.message === 'Item already exists') {
            return {
                statusCode: 409, // 409 Conflict
                body: JSON.stringify({
                    error: 'Item already exists'
                }),
            };
        }

        // Log the error for debugging
        console.error("Error: ", e);

        // Handle other unknown errors
        return {
            statusCode: e.statusCode || 500,
            body: JSON.stringify({
                error: e.message || "Internal Server Error"
            }),
        };
    }

};