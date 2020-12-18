// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인

// USER CREATE - 새 유저 등록
// user_id가 기본키로 등록되어 이미 등록된 사용자는 중복 등록되지 않는다.
exports.createUser = (user_id, user_major, auth_level, cb) => {
    const sql = "INSERT INTO USER SET user_id=?, user_major=?, auth_level=?, nickname=?";

    db.query(sql, [user_id, user_major, auth_level, nickname], (err, results) => {
        if (err) {
            console.log("insert err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}