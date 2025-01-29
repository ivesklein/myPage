const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.S3Storage = class S3Storage{
    async createDoc(data){
        // new file with name data.id and content data.content
        try {
            const params = {
                Bucket: process.env.DOCS_BUCKET,
                Key: `docs/${data.id}.md`,
                Body: data.content,
                ContentType: 'text/plain',
            };
            await s3.putObject(params).promise();
            return {created:1};
        } catch (error) {
            throw new Error(error.message);
        }

    }

    async read(id){
        /*const res = await Page.get(id);
        if(!res){
            throw new Error('Item not found')
        }
        return await Page.get(id);*/
    }

    async getAll(){
        //return await Page.scan().exec(); // Scan all users
    }

    async update({ id, content }){
        /*const page = await Page.get(id);
        page.content = content;
        return await page.save();*/
    }

    async delete(id){
        /*await this.read(id)
        await Page.delete(id);
        return {deleted:1}*/
    }
}