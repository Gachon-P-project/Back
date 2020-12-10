// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인

// 과목게시판 전체 글 조회
// 클라이언트에서 과목명/교수명을 파라미터로 전달하면 해당하는 튜플을 전송
exports.getList = (subject_name, professor_name, cb) => {
    const sql = "SELECT * FROM BOARD WHERE subject_name=? AND professor_name=?";

    db.query(sql, [subject_name, professor_name], (err, results) => {
        if (err) {
            console.log("select err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}