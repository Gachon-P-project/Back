const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const https = require('https');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const routes = require('./routes');
const PORT = 17394;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_mothod'));
app.use(routes);

http.createServer(app).listen(PORT, () =>{
    console.log('Express Run(http) --- ', PORT);
})
https.createServer({
    key: fs.readFileSync('./security/server.key'),
    cert: fs.readFileSync('./security/server.cert')
}, app)
 .listen(443, () => {
     console.log('Express Run(https) --- ', 443);
 })
