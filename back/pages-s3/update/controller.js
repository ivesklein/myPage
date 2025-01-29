const yup = require('yup');
const schema = yup.object().shape({
    head: yup.object().shape({
        jwtToken: yup.string().required('authentication is required'),
    }),
    body: yup.object().shape({
        id: yup.string().required('id is required'),
        content: yup.string().required('content is required'),
    }),
  });

exports.controller = async function(data, storage, jwtValidator){
    await schema.validate(data)
    await jwtValidator.validate(data.head.jwtToken)
    try{
        const res = await storage.createDoc(data.body)
        return res;
    }catch(e){
        throw e;
    }
}