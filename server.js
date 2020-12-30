const express = require('express');
const app = express();
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const routes = require('./routes');
const PORT = 17394;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_mothod'));
app.use(routes);

app.listen(PORT, () => {
    console.log('Express Run(http) --- ', PORT);
})