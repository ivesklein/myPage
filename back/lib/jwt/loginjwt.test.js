const { LoginJWT } = require("./loginjwt");

const jwt = new LoginJWT()
let token = ""

test("jwt generate jwk token", () => {

    const idData = {data: "yopo"}
    token = jwt.login(idData)
    expect(token).not.toBe("");

})

test("jwt check jwk token", () => {
    jwt.validate(token);
    expect(true).toBe(true);
})

test("jwt check invalid token", () => {
    expect(() => jwt.validate(token + "asd")).toThrow('invalid signature');
})