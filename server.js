const express = require('express');
const app = express();
const PORT = 17394;

const Routes = require('./route');

app.use(Routes);
app.listen(PORT, () => {
    console.log('Express Run --- ', PORT);
})