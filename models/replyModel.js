// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인



// REPLY CREATE - 새 댓글 작성
// 클라이언트에서 post_no과 user_id를 파라미터로 전달한다.
// 작성할 댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReply = (reply_contents, user_no, post_no, wrt_date, cb) => {
    const sql = "INSERT INTO REPLY (reply_contents, user_no, post_no, wrt_date, bundle_id) VALUES (?, ?, ?, ?, LAST_INSERT_ID()+1)";

    db.query(sql, [reply_contents, user_no, post_no, wrt_date], (err, results) => {
        if (err) {
            console.log("insert err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// REPLY UPDATE - 댓글 수정
// 클라이언트에서 reply_no를 파라미터로 전달하면 해당 튜블의 reply_contents를 수정한다.
// 수정할 댓글 내용은 body를 통해 전달된다.
exports.updateReply = (reply_contents, reply_no, cb) => {
    const sql = "UPDATE REPLY SET reply_contents = ? where reply_no = ?";

    db.query(sql, [reply_no, reply_contents], (err, results) => {
        if (err) {
            console.log("update err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}


// REPLY DELETE - 댓글 삭제 (대댓글 있는 경우 '댓글 삭제됨'으로 전환)
// 클라이언트에서 reply_no를 파라미터로 전달하면 해당 튜플을 전환
exports.changeReply = (reply_no, cb) => {
    const sql = "UPDATE REPLY SET reply_contents = '삭제된 댓글입니다.' WHERE reply_no = ?";

    db.query(sql, reply_no, (err, results) => {
        if (err) {
            console.log("update err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })

}


// REPLY DELETE - 댓글 삭제
// 클라이언트에서 reply_no를 파라미터로 전달하면 해당 튜블을 삭제한다.
exports.deleteReply = (reply_no, cb) => {
    const sql = "DELETE FROM REPLY WHERE reply_no = ?";

    db.query(sql, reply_no, (err, results) => {
        if (err) {
            console.log("delete err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}



// REPLY READ - 해당 게시글의 댓글 보기
// 클라이언트에서 post_no을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readReply = (post_no, cb) => {
    const sql = "SELECT * FROM REPLY WHERE post_no = ? ORDER BY bundle_id, reply_no";

    db.query(sql, post_no, (err, results) => {
        if (err) {
            console.log("read err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// REPLY READ - 해당 게시글의 댓글 개수 보기
// 클라이언트에서 post_no을 파라미터로 전달하면 해당하는 튜플의 개수를 전송한다.
// exports.readCountReply = (post_no, cb) => {
//     const sql = "SELECT COUNT(*) as cnt FROM REPLY WHERE post_no = ? ";

//     db.query(sql, post_no, (err, results) => {
//         if (err) {
//             console.log("read err : ", err);
//         }
//         else {
//             cb(JSON.parse(JSON.stringify(results)));
//         }
//     })
// }



// REREPLY CREATE - 대댓글 작성
// 클라이언트에서 user_no, post_no과 부모 댓글의 reply_no를 파라미터로 전달한다.
// 작성할 대댓글 내용은 body를 통해 전달된다.
// post_no과 user_id는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createReReply = (dataObj, cb) => {
    const sql = "INSERT INTO REPLY SET ? ";

    db.query(sql, dataObj, (err, results) => {
        if (err) {
            console.log("insert err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}