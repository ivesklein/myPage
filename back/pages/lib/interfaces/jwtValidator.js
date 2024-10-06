exports.JWTValidator = class JWTValidator {
    async login(idData) {
        throw new Error("Method 'validate' must be implemented.");
    }

    async validate(token) {
        throw new Error("Method 'validate' must be implemented.");
    }
}