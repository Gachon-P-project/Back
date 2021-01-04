// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인

// SCRAP CREATE - 게시글 스크랩/스크랩 취소
exports.createScrap = (post_no, user_no, cb) => {
    const sqlScrapCnt = "SELECT count(*) AS scrap_cnt FROM SCRAP WHERE post_no = ?"
    const sqlScrapInsert = "INSERT INTO SCRAP (post_no, user_no) VALUES (?, ?)";
    const sqlScrapDelete = "DELETE FROM SCRAP WHERE post_no = ?"

    db.query(sqlScrapCnt, [post_no, user_no], (err, results) => {
        if (err) {
            console.log("insert err : ", err);
        }
        else {
            const scrap_cnt = JSON.parse(JSON.stringify(results));

            if (scrap_cnt[0].scrap_cnt == 0) {
                db.query(sqlScrapInsert, [post_no, user_no], (err, results) => {
                    if (err) {
                        console.log("insert err : ", err);
                    }
                    else {
                        cb(JSON.parse(JSON.stringify(results)));
                    }
                })
            } else {
                db.query(sqlScrapDelete, post_no, (err, results) => {
                    if (err) {
                        console.log("delete err : ", err);
                    }
                    else {
                        cb(JSON.parse(JSON.stringify(results)));
                    }
                })
            }
        }
    })
}

// SCRAP READ - 스크랩한 게시글 조회
// 클라이언트에서 사용자 학번을 파라미터로 전달
exports.readScrap = (user_no, cb) => {
    const sql = "select b.*, s.scrap_no, (select count(*) from REPLY where post_no=b.post_no) as reply_cnt, (select count(*) from LIKEBOARD where post_no=b.post_no) as like_cnt, (select count(*) from LIKEBOARD where post_no=b.post_no and user_no=?)  as is_liked from BOARD b inner join SCRAP s on b.post_no = s.post_no and s.user_no=" + db.escape(user_no) + " order by s.scrap_no desc";

    db.query(sql, user_no, (err, results) => {
        if (err) {
            console.log("read err : ", err);
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}