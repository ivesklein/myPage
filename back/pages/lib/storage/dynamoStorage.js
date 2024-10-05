const dynamoose = require("dynamoose");
const { DBConector } = require("../interfaces/dbConector");
const Page = require("./pageModel");

if(!process.env.AWS_ACCESS_KEY_ID){throw new Error("envvar AWS_ACCESS_KEY_ID not defined")}
if(!process.env.AWS_SECRET_ACCESS_KEY){throw new Error("envvar AWS_SECRET_ACCESS_KEY not defined")}
if(!process.env.AWS_REGION){throw new Error("envvar AWS_REGION not defined")}

exports.DynamoStorage = class DynamoStorage extends DBConector{
    async create(data){
        try{
            await this.read(data.id)
        }catch(e){
            const newPage = new Page(data);
            const res = await newPage.save();
            return res;
        }
        throw new Error('Item already exist')
    }

    async read(id){
        const res = await Page.get(id);
        if(!res){
            throw new Error('Item not found')
        }
        return await Page.get(id);
    }

    async getAll(){
        return await Page.scan().exec(); // Scan all users
    }

    async update({ id, content }){
        const page = await Page.get(id);
        page.content = content;
        return await page.save();
    }

    async delete(id){
        await this.read(id)
        await Page.delete(id);
        return {deleted:1}
    }
}