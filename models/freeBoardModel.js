// DB 연결
const mysqlConObj = require('../config/mysql');
// mysqlConObj.open(db); // 정상 연결 확인
const db = mysqlConObj.init();

// FREE BOARD CREATE - 자유게시판 새 글 작성
// 클라이언트는 body에 post_title, post_contents, reply_yn, user_no를 전달
exports.createBoard = (dataObj, cb) => {
    const sql = "INSERT INTO FREEBOARD SET ? ";

    db.query(sql, dataObj, (err, results) => {
        if (err) {
            console.log("create err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// FREE BOARD UPDATE - 자유게시판 내 선택한 글 수정
// 클라이언트에서 post_no을 파라미터로 전달하면 해당 튜블의 post_title, post_contents를 수정한다.
// 수정할 글 제목과 글 내용은 body를 통해 전달된다.
exports.updateBoard = (post_title, post_contents, post_no, cb) => {
    const sql = "UPDATE FREEBOARD SET post_title = ?, post_contents = ? where post_no = ?";

    db.query(sql, [post_title, post_contents, post_no], (err, results) => {
        if (err) {
            console.log("update err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// FREE BOARD DELETE - 자유게시판 내 선택한 글 삭제
// 클라이언트에서 post_no을 전달하면 해당 튜플을 삭제한다.
exports.deleteBoard = (post_no, cb) => {
    const sql = "DELETE FROM FREEBOARD WHERE post_no = ?";

    db.query(sql, post_no, (err, results) => {
        if (err) {
            console.log("delete err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results))); 
        }
    })
}