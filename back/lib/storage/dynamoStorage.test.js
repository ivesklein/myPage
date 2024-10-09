const { DynamoStorage } = require("./dynamoStorage.cjs");

const storage = new DynamoStorage();

test('Delete nothing, returns error', async () => {
    await expect(storage.delete("test1-item")).rejects.toThrow('Item not found');
})

test('Read nothing, returns error', async () => {
    await expect(storage.read("test1-item")).rejects.toThrow('Item not found');
})

const test1Item1 = {
    id: "test1-item",
    content: "Unit Test"
}

const test1Item2 = {
    id: "test1-item",
    content: "Unit Test Modified"
}

test('Create item1', async () => {
    const res = await storage.create(test1Item1)
    expect(res).toEqual(expect.objectContaining(test1Item1));
})

test('Create existent item1, return error', async () => {
    await expect(storage.create(test1Item1)).rejects.toThrow('Item already exist');
})

test('Read item 1 created', async () => {
    const res = await storage.read("test1-item")
    expect(res).toEqual(expect.objectContaining(test1Item1));
})

test('Updates item 1', async () => {
    const res = await storage.update(test1Item2)
    expect(res).toEqual(expect.objectContaining(test1Item2));
})

test('Read item 1 updated', async () => {
    const res = await storage.read("test1-item")
    expect(res).toEqual(expect.objectContaining(test1Item2));
})

test('deletes item 1', async () => {
    const res = await storage.delete("test1-item")
    expect(res).toStrictEqual({"deleted": 1})
})

test('Read deleted item, returns error', async () => {
    await expect(storage.read("test1-item")).rejects.toThrow('Item not found');
})

const test2Item1 = {
    id: "test2-item1",
    content: "Unit Test 2.1"
}

const test2Item2 = {
    id: "test2-item2",
    content: "Unit Test 2.2"
}

test('Create item2.1', async () => {
    const res = await storage.create(test2Item1)
    expect(res).toEqual(expect.objectContaining(test2Item1));
})

test('Create item2.2', async () => {
    const res = await storage.create(test2Item2)
    expect(res).toEqual(expect.objectContaining(test2Item2));
})

const checkItemInList = (expectedItem, receivedArray) => {
    return receivedArray.some(item => 
        item.id === expectedItem.id && item.content === expectedItem.content
    );
}

test('read list', async () => {
    const res = await storage.getAll()
    // Check if the expected item is in the received array


    expect(checkItemInList(test2Item1, res)).toBe(true);
    expect(checkItemInList(test2Item2, res)).toBe(true);
})

test('delete list', async() => {
    await storage.delete("test2-item1")
    await storage.delete("test2-item2")

    const res = await storage.getAll()
    expect(checkItemInList(test2Item1, res)).toBe(false);
    expect(checkItemInList(test2Item2, res)).toBe(false);
})