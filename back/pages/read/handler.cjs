//import { DynamoStorage } from "../lib/storage/dynamoStorage";
//import { controller } from "./controller";
const { DynamoStorage } = require("../lib/storage/dynamoStorage.cjs");
const { controller } = require("./controller.cjs");

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
        // Log the error for debugging
        console.error("Error: ", e);

        // Handle known 'Item not found' error
        if (e.message === 'Item not found') {
            return {
                statusCode: 404, // 404 Not Found
                body: JSON.stringify({
                    error: 'Item not found'
                }),
            };
        }

        // Handle other unknown errors
        return {
            statusCode: e.statusCode || 500,
            body: JSON.stringify({
                error: e.message || "Internal Server Error"
            }),
        };
    }

};