# Login API for Grass Roots Survey Mobile App
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
Success (200)
```json
{
    "access_token": "00D28000000W2x5!AQQAQNTgJ_KyS9.BuohNq9_Awami_.OL9MiZe24bTt75Un56KChhd7lfJ2J.R_XdgP2cvx_clufew6i9acH8FKG9wacaDdgj",
    "instance_url": "https://YOUR_INSTANCE_OR_DOMAIN.salesforce.com"
}
```

Error (403)
```json
{
    "error": "invalid_grant",
    "error_description": "Wrong email or password."
}
```
