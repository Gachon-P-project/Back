const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 17394;

const Routes = require('./route');

app.use(bodyParser.json());
app.use(Routes);
app.listen(PORT, () => {
    console.log('Express Run --- ', PORT);
})