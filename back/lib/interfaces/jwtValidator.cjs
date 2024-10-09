exports.JWTValidator = class JWTValidator {
    login(idData) {
        throw new Error("Method 'validate' must be implemented.");
    }

    validate(token) {
        throw new Error("Method 'validate' must be implemented.");
    }
}