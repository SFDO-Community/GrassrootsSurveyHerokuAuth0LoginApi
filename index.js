const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const jsforce = require('jsforce')

const app = express()
const PORT = process.env.PORT || 5000

dotenv.config();

const AuthenticationClient = require('auth0').AuthenticationClient;
const auth0 = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/login', async (req, res, next) => {
  if (!process.env.SALESFORCE_LOGIN_URL.endsWith('.salesforce.com')) {
    res.status(400).send({
      "error": "invalid_environment_variable",
      "error_description": "SALESFORCE_LOGIN_URL must end with '.salesforce.com'. Contact your administrator to see Heroku setting."
    });
  }
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(401).send({
      "error": "missing_required_fields",
      "error_description": "email or password is not specified, or invalid format."
    });
  }
  try {
    await auth0.oauth.passwordGrant({
      username: req.body.email,
      password: req.body.password,
      realm: 'Username-Password-Authentication'
    });
    await createSalesforceConnection(res);
  } catch (error) {
    console.log(error);
    // Auth0 throws an error as follows.
    // error = { statusCode: 401, message: '{"error":"invalid_grant", "error_description":"Wrong email or password." }'
    const message = JSON.parse(error.message);
    res.status(error.statusCode).send(message);
  } 
})

async function createSalesforceConnection(res) {
  try {
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL
    });
    await conn.login(
      process.env.SALESFORCE_INTEGRATION_USERNAME,
      process.env.SALESFORCE_INTEGRATION_PASSWORD + process.env.SALESFORCE_INTEGRATION_TOKEN
    );
    const response = {
      "access_token": conn.accessToken,
      "instance_url": conn.instanceUrl,
    };
    res.send(response);
  } catch (error) {
    console.error(error);
    return Promise.reject({
      statusCode: 403,
      message: `{"error":"invalid_salesforce_connection", "error_description":"${error.message}"}`,
    });
  }
}