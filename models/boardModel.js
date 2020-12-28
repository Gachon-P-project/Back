// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인

// 과목게시판 전체 글 조회
// 클라이언트에서 과목명/교수명을 파라미터로 전달하면 해당하는 튜플을 전송
exports.readList = (subject_name, professor_name, cb) => {
    // const sql = "SELECT * FROM BOARD WHERE subject_name=? AND professor_name=?";
    
    // 게시글 목록에 댓글 개수 출력 
//    const sql = "select b.*, (select count(*) from REPLY where post_no=b.post_no) as reply_cnt from BOARD b where b.subject_name=? and b.professor_name=?";

    const sql = "select b.*, (select count(*) from REPLY where post_no=b.post_no) as reply_cnt, (select count(*) from LIKE where post_no=b.post_no ) as like_cnt from BOARD b where b.subject_name=? and b.professor_name=?";

    db.query(sql, [subject_name, professor_name], (err, results) => {
        if (err) {
            console.log("select err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// BOARD CREATE - 과목게시판 새 글 작성
// 클라이언트는 body에 post_title, post_contents, reply_yn, major_name, subject_name, professor_name, user_id를 전달
exports.createBoard = (dataObj, cb) => {
    const sql = "INSERT INTO BOARD SET ? ";

    db.query(sql, dataObj, (err, results) => {
        if (err) {
            console.log("create err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// BOARD UPDATE - 과목게시판 내 선택한 글 수정
// 클라이언트에서 post_no을 파라미터로 전달하면 해당 튜블의 post_title, post_contents를 수정한다.
// 수정할 글 제목과 글 내용은 body를 통해 전달된다.
exports.updateBoard = (post_title, post_contents, post_no, cb) => {
    const sql = "UPDATE BOARD SET post_title = ?, post_contents = ? where post_no = ?";

    db.query(sql, [post_title, post_contents, post_no], (err, results) => {
        if (err) {
            console.log("update err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// BOARD DELETE - 과목게시판 내 선택한 글 삭제
// 클라이언트에서 post_no을 전달하면 해당 튜플을 삭제한다.
exports.deleteBoard = (post_no, cb) => {
    const sql = "DELETE FROM BOARD WHERE post_no = ?";

    db.query(sql, post_no, (err, results) => {
        if (err) {
            console.log("delete err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// BOARD READ - 과목게시판 특정 단어로 글 조회
// 클라이언트에서 과목명/특정값을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readSomeList = (subject_name, professor_name, post_word, cb) => {
    const sql = "SELECT * FROM BOARD WHERE subject_name = ? AND professor_name = ? AND (post_contents OR post_title LIKE "+ db.escape('%'+post_word+'%')+")";
    // const sql = "SELECT * FROM BOARD WHERE subject_name=?, professor_name = ? AND (post_contents OR post_title LIKE %post_word%";

    db.query(sql, [subject_name, professor_name], (err, results) => {
        if (err) {
            console.log("read err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// BOARD READ - 과목게시판 내 선택한 글 상세보기
// 클라이언트에서 post_no을 전달하면 해당 튜플을 전송한다.
exports.readDetailBoard = (post_no, cb) => {
    const sql = "SELECT * FROM BOARD WHERE post_no = ?";

    db.query(sql, post_no, (err, results) => {
        if (err) {
            console.log("read err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// MY BOARD READ - 과목게시판 내가 쓴 글 조회
// router.get("/select/myBoard/:userNo", boardController.readMyBoardList)
// 클라이언트에서 user_no을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readMyBoardList = (user_no, cb) => {

    // 쿼리문 수정 예정 user_id -> user_no
    const sql = "SELECT * FROM BOARD WHERE user_id = ?";

    db.query(sql, user_no, (err, results) => {
        if (err) {
            console.log("read err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}