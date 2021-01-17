# Login API for Grass Roots Survey Mobile App
Visit [our wiki](https://github.com/SFDO-Community-Sprints/GrassRootsSurveyMobileApp/wiki) for the project details and further setup instructions.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Setup
1. Deploy this app to Heroku using above button.
2. Open Auth0 app and enable [Password] authentication type at advanced settings section. Then add your users.
3. Create an integration user in your Salesforce org.
4. Open the Heroku app setting and set config variables for the integration user.

## API 
### POST `/login`
#### Request
* Content-Type: `application/json`
* Body:
```json
{
    "email": "john@example.com",
    "password": "test1234!"
}
```

#### Reponsse
##### Success (200)
```json
{
    "access_token": "00D28000000W2x5!AQQAQNTgJ_KyS9.BuohNq9_Awami_.OL9MiZe24bTt75Un56KChhd7lfJ2J.R_XdgP2cvx_clufew6i9acH8FKG9wacaDdgj",
    "instance_url": "https://YOUR_INSTANCE_OR_DOMAIN.salesforce.com"
}
```
##### Error (403, Password realm is not setup yet)
Make sure that password type grant is enabled in your default auth0 app setting.
```json
{
    "error": "unauthorized_client",
    "error_description": "Grant type 'http://auth0.com/oauth/grant-type/password-realm' not allowed for the client.",
    "error_uri": "https://auth0.com/docs/clients/client-grant-types"
}
```

##### Error (403, Invalid user email or password)
Make sure that your request is correct.
```json
{
    "error": "invalid_grant",
    "error_description": "Wrong email or password."
}
```

##### Error (403, Invalid config variables)
Make sure that your config variables in Heroku setting are correct.
```json
{
    "error": "invalid_salesforce_connection",
    "error_description": "INVALID_LOGIN: Invalid username, password, security token; or user locked out."
}
```