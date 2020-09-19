# System Poll Backend

## Configurations

The configurations are stored in environment variables to provide security and portability to the **development/deployment** life cycle of the project.

### Configuration exmaple

Create in the project root folder a **.env** file with the proper configuration variables like shown below or just rename the **.env.example** file to **.env** and add your configurations

```bash
SERVER_PORT=3000
URIS='mongodb://localhost:27017/system-poll'
JWT_SECRET='secret-key'
ERROFILE=./logs/errors.log
```

## API Documentation

### Register a New User

To register a new user you need to pass the username and password. Avobe is the real example using axios npm package

```js
var axios = require('axios');
var data = JSON.stringify({ username: 'hola1', password: 'hola1' });

var config = {
  method: 'post',
  url: 'localhost:3000/user/register',
  headers: {
    'Content-Type': 'application/json',
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
```

**_Taken from Postman_**

### Log in a registered user

To log in a user you need to pass the username and password. Avobe is the real example using axios npm package

```js
var axios = require('axios');
var data = JSON.stringify({ username: 'hola1', password: 'hola1' });

var config = {
  method: 'post',
  url: 'localhost:3000/user/login',
  headers: {
    'Content-Type': 'application/json',
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
```

**_Taken from Postman_**

### Get User Information

This is a protected endpoint. In order to get the user information you need to pass the JSON Web Token provided at the end of the **login** workflow. This token should be provided in a particular header called **header-auth-token** in the **GET** request. Avobe is the real example using axios npm package

```js
var axios = require('axios');

var config = {
  method: 'get',
  url: 'localhost:3000/user/user',
  headers: {
    'Content-Type': 'application/json',
    'header-auth-token':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNjYzMDBjOGM4YzQ2NTllODljYWFmYiIsImlhdCI6MTYwMDUzMzE2NywiZXhwIjoxNjAwNTM2NzY3fQ.hQ6CH-IxXnEQ_jmxMMBaDiWBbxeDr3lBT_W8WBjDT1A',
  },
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
```

**_Taken from Postman_**
