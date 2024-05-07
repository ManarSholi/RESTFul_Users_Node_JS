const bodyParser = require('body-parser');
const express = require('express');
const fileSystem = require('fs');

const app = express();
let lastIndex;

app.get('/list_users', (request, response) => {
    fileSystem.readFile(`${__dirname}/users.json`, 'utf8', (error, data) => {
        console.log(data);
        response.end(data);
    });
});

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/index.html`);
});

let urlEncodedParser = bodyParser.urlencoded({extended: false});

app.post('/add_user', urlEncodedParser, (request, response) => {
    const body = request.body;
    console.log("request.body: ", request.body);
    console.log(body);
    console.log(request.query);

    fileSystem.readFile(`${__dirname}/users.json`, 'utf8', (error, data) => {
        const jsonData = JSON.parse(data);
        const keys = Object.keys(jsonData);
        let lastUserKey = keys[keys.length - 1];
        let lastUserId = jsonData[lastUserKey].id;
        lastIndex = lastUserKey[lastUserKey.length - 1];
        lastIndex = parseInt(lastIndex);
        let userKey = 'user' + (lastIndex + 1);

        jsonData[userKey] = {
            'name': body.name,
            'password': body.password,
            'profession': body.profession,
            'id': lastUserId + 1
        }
        
        // Write the updated JSON data back to the file
        fileSystem.writeFile(`${__dirname}/users.json`, JSON.stringify(jsonData, null, 2), 'utf8', (writeError) => {
            if (writeError) {
                console.error('Error writing to users.json:', writeError);
                response.status(500).send('Internal Server Error');
                return;
            }

            console.log('User added successfully:', jsonData[userKey]);
            response.json(JSON.stringify(jsonData)); // You can send the updated JSON as a response if needed
        });
    });
});

let server = app.listen(8081, '127.0.0.1', () => {
    const serverAddress = server.address();

    let host = serverAddress.address;
    let port = serverAddress.port;

    console.log(`Example app listening at http://${host}:${port}`);
});
