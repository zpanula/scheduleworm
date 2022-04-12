const { generateHash, generateAuthToken } = require('./user-service.js');

describe('generateHash', () => {
  it('throws an error when given no input', () => {
    expect(async () => generateHash('')).rejects.toThrow();
  });

  it('generates a hash when given input', async () => {
    const result = await generateHash('string');
    expect(result).toMatch(/\$2b\$10\$/);
  });
});

describe('generateAuthToken', () => {
  process.env.API_SECRET_KEY = 'secret';

  it('throws an error when no input is given', () => {
    expect(() => generateAuthToken()).toThrow();
  });

  it('returns a new JWT token when given a user', async () => {
    const user = {
      email: 'example@example.com',
      password: await generateHash('password'),
    };
    expect(generateAuthToken(user)).toMatch(
      /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJpYXQiOjE2NDk4Nz/
    );
  });
});
