const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const PORT = 17394;

const Routes = require('./route');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(Routes);

app.get('/', (req, res) => {
    res.send('connected')
})

http.createServer(app).listen(PORT, () =>{
    console.log('Express Run(http) --- ', PORT);
})
https.createServer({
    key: fs.readFileSync('./security/server.key'),
    cert: fs.readFileSync('./security/server.cert')
}, app)
 .listen(443, () => {
     console.log('Express Run(https) --- ', 443);
<<<<<<< HEAD
 })



=======
 })
>>>>>>> 7c3497512cdad9644607582aa89409be68a5646e
