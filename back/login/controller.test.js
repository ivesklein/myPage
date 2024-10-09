const { controller } = require('./controller.cjs');
const yup = require('yup');

const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

describe('controller', () => {
  let jwtValidator;

  beforeEach(() => {
    jwtValidator = {
      login: jest.fn(),
    };

    // Mock the environment variables
    process.env.ADMIN_USER = 'admin';
    process.env.ADMIN_PASS = 'password';
  });

  it('should return a token if credentials are correct', async () => {
    // Mock jwtValidator.login to return a token
    jwtValidator.login.mockReturnValue('mocked-token');

    const hp = await hashPassword('password')
    const hp2 = await hashPassword(hp+Math.floor(Date.now() / 1000 / 3600) * 3600)

    const data = {
      user: 'admin',
      pass: hp2,
    };

    const result = await controller(data, jwtValidator);

    // Expect the login function to have been called with correct idData
    expect(jwtValidator.login).toHaveBeenCalledWith({ data: 'admin' });

    // Expect the returned token to be the mocked token
    expect(result).toBe('mocked-token');
  });

  it('should throw an error if credentials are incorrect', async () => {
    const data = {
      user: 'wrongUser',
      pass: 'wrongPass',
    };

    await expect(controller(data, jwtValidator)).rejects.toThrow('Who tf are you?');
  });

  it('should throw an error if user or pass is missing', async () => {
    const invalidData = { user: '' }; // Missing password

    await expect(controller(invalidData, jwtValidator)).rejects.toThrow(yup.ValidationError);
  });
});