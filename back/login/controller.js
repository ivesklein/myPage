const yup = require('yup');
const schema = yup.object().shape({
    user: yup.string().required('user is required'),
    pass: yup.string().required('pass is required'),
});

const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

exports.controller = async function(data, jwtValidator){
    await schema.validate(data)

    const hp = await hashPassword(process.env.ADMIN_PASS)
    const hp2 = await hashPassword(hp+Math.floor(Date.now() / 1000 / 3600) * 3600)

    if(data.user===process.env.ADMIN_USER && data.pass===hp2){
        const idData = {data: process.env.ADMIN_USER}
        const token = jwtValidator.login(idData)
        return token;
    }else{
        throw new Error("Who tf are you?");
    }
}