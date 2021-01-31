// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인


exports.getNotice = (major, callback) => {
    const sql = "SELECT notice_url FROM NOTICE_APART WHERE notice_major=?"

    db.query(sql, major, (err, results) => {
        if (err) {
            console.log("select err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            console.log("notice url selected:", major);
            callback(JSON.parse(JSON.stringify(results)));
        }
    })
}


