exports.controller = async function(idPage, storage){
    return await storage.read(idPage)
}