const { handler } = require("./handler.cjs")

test('handler ask 404', async () => {

    const event = {
        pathParameters: {
            pageId: "404"
        }
    }

    const expected = {
        statusCode: 404, // 404 Not Found
        body: JSON.stringify({
            error: 'Item not found'
        }),
    };

    expect(await handler(event)).toStrictEqual(expected)

})