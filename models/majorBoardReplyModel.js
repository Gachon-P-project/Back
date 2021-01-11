// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인


// 댓글 작성
exports.createReply = (reply_contents, user_no, post_no, wrt_date, cb) => {
    const sql = "INSERT INTO MAJORREPLY (reply_contents, user_no, post_no, wrt_date, board_flag) VALUES (?, ?, ?, ?, 2)";
    const sqlLastInsert = "UPDATE MAJORREPLY SET bundle_id = LAST_INSERT_ID() WHERE reply_no = LAST_INSERT_ID()"
    db.query(sql, [reply_contents, user_no, post_no, wrt_date], (err, results) => {
        if (err) {
            console.log("insert err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            db.query(sqlLastInsert, (err, results) => {
                if (err) {
                    console.log("lastInsert err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                }
                else {
                    
                    cb(JSON.parse(JSON.stringify(results)));
                }
            })
        }
    })
}


// 댓글 삭제
exports.deleteReply = (bundleId, cb) => {
    const sql = "SELECT COUNT(*) AS bundle FROM MAJORREPLY WHERE bundle_id=?";
    const sqlDelete = "DELETE FROM MAJORREPLY WHERE reply_no = ?";
    const sqlChange = "UPDATE MAJORREPLY SET reply_contents = '삭제된 댓글입니다.', is_deleted = 1 WHERE reply_no = ?"
    db.query(sql, bundleId, (err, results) => {
        if (err) {
            console.log("delete err : ", err);
        }
        else {
            const bundle = JSON.parse(JSON.stringify(results));

            if (bundle[0].bundle == 1) {
                db.query(sqlDelete, bundleId, (err, results) => {
                    if (err) {
                        console.log("delete err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                    }
                    else {
                        
                        cb(JSON.parse(JSON.stringify(results)));
                    }
                })
            } else {
                db.query(sqlChange, bundleId, (err, results) => {
                    if (err) {
                        console.log("change err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                    }
                    else {
                        cb(JSON.parse(JSON.stringify(results)));
                    }
                })
            }
        }
    })
}



// 대댓글 삭제
exports.deleteRereply = (reply_no, cb) => {
    const sql = "DELETE FROM MAJORREPLY WHERE reply_no = ?";
    db.query(sql, reply_no, (err, results) => {
        if (err) {
            console.log("delete err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}


// 전체 댓글 조회
exports.readReply = (post_no, cb) => {
    const sql = "SELECT R.*, U.nickname FROM MAJORREPLY R LEFT OUTER JOIN USER U ON R.user_no = U.user_no WHERE post_no = ? ORDER BY bundle_id, reply_no;";

    db.query(sql, post_no, (err, results) => {
        if (err) {
            console.log("read err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}
 

// 대댓글 작성
exports.createReReply = (dataObj, cb) => {
    const sql = "INSERT INTO MAJORREPLY SET ? ";

    db.query(sql, dataObj, (err, results) => {
        if (err) {
            console.log("insert err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}