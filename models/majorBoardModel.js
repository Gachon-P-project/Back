// DB 연결
const mysqlConObj = require('../config/mysql');
// mysqlConObj.open(db); // 정상 연결 확인
const db = mysqlConObj.init();