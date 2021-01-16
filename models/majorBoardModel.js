// DB 연결
const mysqlConObj = require('../config/mysql');
// mysqlConObj.open(db); // 정상 연결 확인
const db = mysqlConObj.init();

// 게시글 작성
// 클라이언트는 body에 post_title, post_contents, reply_yn, major_name, subject_name, professor_name, user_no를 전달
exports.createBoard = (dataObj, cb) => {
    const sql = "INSERT INTO MAJORBOARD SET ? ";

    db.query(sql, dataObj, (err, results) => {
        if (err) {
            console.log("create err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// 전체 게시글 조회 
// 클라이언트에서 사용자학번, 과목명, 교수명을 파라미터로 전달하면 해당하는 튜플을 전송
exports.readList = (board_flag, user_no, major, page_num, cb) => {
    // 게시글 목록에 댓글 개수, 좋아요 개수 출력 
    const sql = "select b.*, (select nickname from USER where user_no = b.user_no) as nickname, (select count(*) from MAJORREPLY where post_no=b.post_no) as reply_cnt, (select count(*) from LIKEBOARD where post_no=b.post_no and board_flag = ?) as like_cnt, (select count(*) from LIKEBOARD where user_no=? and post_no=b.post_no and board_flag=2) as like_user from MAJORBOARD b where major_name=? order by post_no desc limit "+page_num+", 10";

    db.query(sql, [board_flag, user_no, major], (err, results) => {
        if (err) {
            console.log("select err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// 특정 게시글 조회
// 클라이언트에서 과목명/특정값을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readSomeList = (board_flag, user_no, major, post_word, page_num, cb) => {
    const sql ="select b.*, (select nickname from USER where user_no = b.user_no) as nickname, (select count(*) from MAJORREPLY where post_no=b.post_no) as reply_cnt, (select count(*) from LIKEBOARD where post_no=b.post_no and board_flag = ?) as like_cnt, (select count(*) from LIKEBOARD where post_no=b.post_no and user_no=? and board_flag=2) as like_user from MAJORBOARD b WHERE board_flag = " + db.escape(board_flag) + " AND (post_contents LIKE "+ db.escape('%'+post_word+'%')+" OR post_title LIKE "+ db.escape('%'+post_word+'%')+") AND major_name=? order by post_no desc limit "+page_num+", 10";

    db.query(sql, [board_flag, user_no, major], (err, results) => {
        if (err) {
            console.log("read err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// 게시글 수정
// 클라이언트에서 post_no을 파라미터로 전달하면 해당 튜블의 post_title, post_contents를 수정한다.
// 수정할 글 제목과 글 내용은 body를 통해 전달된다.
exports.updateBoard = (post_title, post_contents, post_no, cb) => {
    const sql = "UPDATE MAJORBOARD SET post_title = ?, post_contents = ? where post_no = ?";

    db.query(sql, [post_title, post_contents, post_no], (err, results) => {
        if (err) {
            console.log("update err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// BOARD DELETE - 과목게시판 내 선택한 글 삭제
// 클라이언트에서 post_no을 전달하면 해당 튜플을 삭제한다.
exports.deleteBoard = (post_no, cb) => {
    const sql = "DELETE FROM MAJORBOARD WHERE post_no = ?";

    db.query(sql, post_no, (err, results) => {
        if (err) {
            console.log("delete err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results))); 
        }
    })
}