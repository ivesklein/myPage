const jwt = require('jsonwebtoken');
const { JWTValidator } = require("../interfaces/jwtValidator");

if(!process.env.JWK_SECRET){throw new Error("envvar JWK_SECRET not defined")}

exports.LoginJWT = class LoginJWT extends JWTValidator {
    login(idData) {
        return jwt.sign(idData, process.env.JWK_SECRET, { expiresIn: '1h' });
    }

    validate(token) {
        return jwt.verify(token, process.env.JWK_SECRET);
    }
}