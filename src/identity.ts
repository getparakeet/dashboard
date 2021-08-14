const stytch = require('stytch');

const client = new stytch.Client({
  project_id: "project-test-9a49af58-63b0-428f-8962-0abf5f18215e",
  secret: "secret-test-q-JAcnKWmuzjFEDGx0wXTCuBFEKv0-cp0IU=",
  env: stytch.envs.test
});
export async function loginOrSignup(email: string) {
  const params = {
    email: email,
    login_magic_link_url: "http://localhost:3000/auth/callback",
    signup_magic_link_url: "http://localhost:3000/auth/callback",
  };

  const response = await client.magicLinks.email.loginOrCreate(params);
  
  return response;
}