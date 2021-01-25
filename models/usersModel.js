// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인

// 사용자 등록
// user_id가 기본키로 등록되어 이미 등록된 사용자는 중복 등록되지 않는다.
exports.createUser = (user_no, user_id, user_name, nickname, user_major, auth_level, cb) => {
    const sql = "INSERT INTO USER SET user_no=?, user_id=?, user_name=?, nickname=?, user_major=?, auth_level=?";

    db.query(sql, [user_no, user_id, user_name, nickname, user_major, auth_level], (err, results) => {
        if (err) {
            console.log("insert err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// 닉네임 수정
exports.nicknameUpdateUser = (nickname, user_no, cb) => {
    const sql = "UPDATE USER SET nickname = ? where user_no = ?;"

    db.query(sql, [nickname, user_no], (err, results) => {
        if (err) {
            console.log("update err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            cb(JSON.parse(JSON.stringify(results)));
        }
    })
}

// 수업 강의 url 조회
exports.readSubjectUrl = (subject, professor, cb) => {
    const sql = "SELECT DISTINCT subject_url FROM SUBJECT as s WHERE s.subject_name LIKE ? and s.subject_member_code IN (SELECT professor_code FROM PROFESSOR WHERE professor_name=?)";

    let url = ''
    db.query(sql, [subject+'%', professor], async (err, results) => {
        if(err) {
            console.log("select subject url err :", err, new Date().toLocaleDateString("ko-KR", {timeZone: "Asia/Seoul"}));
        } else {
            try {
                url = JSON.parse(JSON.stringify(results))[0].subject_url;
                cb(url)
            }catch(e) {
                console.log(e)
            }
        }
    })
}