# System Poll Backend

## Configurations

The configurations are stored in environment variables to provide security and portability to the **development/deployment** life cycle of the project.

### Configuration exmaple

Create in the project root folder a **.env** file with the proper configuration variables like shown below or just rename the **.env.example** file to **.env** and add your configurations

```bash
SERVER_PORT=3000
URIS='mongodb://localhost:27017/system-poll'
ERROFILE=./logs/errors.log
```
