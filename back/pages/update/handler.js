const { DynamoStorage } = require("../../lib/storage/dynamoStorage.js");
const { LoginJWT } = require("../../lib/jwt/loginjwt.js");
const { controller } = require("./controller.js");

const storage = new DynamoStorage();
const jwtvalidator = new LoginJWT();

exports.handler = async (event) => {
    const {body,headers} = event;
    console.log({authorization: headers.authorization})



    try{

        const bearer = headers.authorization;
        const token = bearer.match(/^Bearer\s(\S+)$/)?.[1];

        const data = {
            head: {
                jwtToken: token
            },
            body: JSON.parse(body)
        }

        const res = await controller(data, storage, jwtvalidator)
        return {
            statusCode: 200,
            body: JSON.stringify(res),
        };
    }catch(e){
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