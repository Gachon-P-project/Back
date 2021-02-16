// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
// mysqlConObj.open(db); // 정상 연결 확인


exports.getNotice = (major, callback) => {
    const sql = "SELECT notice_url FROM NOTICE_APART WHERE notice_major=?"

    let input_major = ""
    switch(major) {
        case "가천대학교":
            input_major = "가천대학교"
            break;
        case "소프트웨어":
            input_major = "소프트웨어학과"
            break;
        case "AI":
            input_major = "AI학과"
            break;
        case "자유전공":
            input_major = "자유전공"
            break;
        case "글로벌경영학트랙":
            input_major = "글로벌경영학트랙"
            break;
        case "첨단의료기기":
            input_major = "첨단의료기기학과"
            break;
        case "게임":
        case "게임·영상학과":
            input_major = "게임·영상학과"
            break;
        case "디스플레이":
            input_major = "디스플레이학과"
            break;
        case "미래자동차":
            input_major = "미래자동차학과"
            break;
        case "의예과(M)":
            input_major = "의예과(M)"
            break;
        case "의학과(M)":
            input_major = "의학과(M)"
            break;
        case "약학과(M)":
            input_major = "약학과(M)"
            break;
        case "의용생체공학과(M)":
            input_major = "의용생체공학과(M)"
            break;
        
    }
    db.query(sql, input_major, (err, results) => {
        if (err) {
            console.log("select err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        }
        else {
            console.log("notice url selected:", major);
            callback(JSON.parse(JSON.stringify(results)));
        }
    })
}


