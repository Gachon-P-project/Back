import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import * as bodyParser from 'body-parser';
import 'dotenv/config'

// 라우트 불러오기
import * as routes from './routes/route';

const PORT = 17394;

// typeORM 연결
createConnection()
    .then(() => {
        console.log("DB Connected . . .");
    })
    .catch((e) => console.log(e));

const app = express();
    
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    }),
);
// app.get('/', (request:Request, response:Response, next:NextFunction) => {
//     response.send(process.env.notice_link);
// });

// 라우트 지정
app.use(routes.router);


app.listen(PORT, () => {
    console.log("Server Running . . .");
})
