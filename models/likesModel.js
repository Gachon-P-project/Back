// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인

// LIKE CREATE - 좋아요, 좋아요 취소
exports.createLike = (post_no, user_no, board_flag, cb) => {
    const sqlLikeCnt = "SELECT count(*) AS like_cnt FROM LIKEBOARD WHERE post_no = ? and user_no = ? and board_flag = ?"
    const sqlInsert = "INSERT INTO LIKEBOARD (post_no, user_no, board_flag) VALUES (?, ?, ?)";
    const sqlDelete = "DELETE FROM LIKEBOARD WHERE post_no = ? AND user_no = ? AND board_flag = ?;";

    db.query(sqlLikeCnt, [post_no, user_no, board_flag], (err, results) => {
        if (err) {
            console.log("insert err : ", err);
        }
        else {
            const like_cnt = JSON.parse(JSON.stringify(results));

            if (like_cnt[0].like_cnt == 0) {
                db.query(sqlInsert, [post_no, user_no, board_flag], (err, results) => {
                    if (err) {
                        console.log("insert err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                    }
                    else {
                        cb(JSON.parse(JSON.stringify(results)));
                    }
                })
            } else {
                db.query(sqlDelete, [post_no, user_no, board_flag], (err, results) => {
                    if (err) {
                        console.log("delete err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                    }
                    else {
                        cb(JSON.parse(JSON.stringify(results)));
                    }
                })
            }
        }
    })
}



// LIKE CREATE - 좋아요 개수 조회
exports.readLike = (post_no, board_flag, cb) => {
    const sql = "SELECT count(*) AS like_cnt FROM LIKEBOARD WHERE post_no = ? AND board_flag = ?";

    db.query(sql, [post_no, board_flag], (err, results) => {
        if (err) {
            console.log("read err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}