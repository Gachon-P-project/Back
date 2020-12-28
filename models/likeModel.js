// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인


// LIKE CREATE - 좋아요
exports.createLike = (dataObj, cb) => {
    const sql = "INSERT INTO LIKEBOARD SET ?";

    db.query(sql, dataObj, (err, results) => {
        if (err) {
            console.log("insert err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}
