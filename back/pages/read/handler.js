const { DynamoStorage } = require("../../lib/storage/dynamoStorage.js");
const { controller } = require("./controller.js");

const storage = new DynamoStorage();

exports.handler = async (event) => {
    const pageId = event.pathParameters.pageId
    try{
        const res = await controller(pageId, storage)
        return {
            statusCode: 200,
            body: JSON.stringify(res),
        };
    }catch(e){
        // Handle known 'Item not found' error
        if (e.message === 'Item not found') {
            return {
                statusCode: 404, // 404 Not Found
                body: JSON.stringify({
                    error: 'Item not found'
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