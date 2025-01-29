const { controller } = require("./controller.js");
const { LoginJWT } = require("../lib/jwt/loginjwt.js");

const jwtvalidator = new LoginJWT();

exports.handler = async (event) => {
    // TODO implement
    const {body,headers} = event;
    try {
        const data = JSON.parse(body);
        // Call the controller function and pass the data
        const res = await controller(data, jwtvalidator);
        return {
            statusCode: 200,
            body: JSON.stringify({token:res}),
        };
    } catch (e) {
        // Handle known error when credentials are invalid
        if (e.message === 'Who tf are you?') {
            return {
                statusCode: 403, // Forbidden
                body: JSON.stringify({ error: e.message }),
            };
        }

        if (e instanceof SyntaxError) {
            return {
                statusCode: 400, // Forbidden
                body: JSON.stringify("Unexpected token"),
            };
        }

        // Handle other errors (like validation errors)
        return {
            statusCode: 400, // Bad request
            body: JSON.stringify({ error: e.message }),
        };
    }
}