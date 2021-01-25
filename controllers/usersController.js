const usersModel = require('../models/usersModel');

// 사용자 등록
// user_id가 기본키로 등록되어 이미 등록된 사용자는 중복 등록되지 않는다.
exports.createUser = (req, res) => {
    let user_no = req.body.user_no;
    let user_id = req.body.user_id;
    let user_name = req.body.user_name;
    let nickname = req.body.nickname;
    let user_major = req.body.user_major;
    let auth_level = 0;     // 기본 0, 관리자일 경우 1로 직접 update

    usersModel.createUser(user_no, user_id, user_name, nickname, user_major, auth_level, (result) => {
        if (result) {
            console.log("user insert completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// 닉네임 수정
exports.nicknameUpdateUser = (req, res) => {
    let nickname = req.body.nickname;
    let user_no = req.body.user_no;

    usersModel.nicknameUpdateUser(nickname, user_no, (result) => {
        if (result) {
            console.log("user nickname update completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// 수업 URL 조회
exports.getSubjcetUrlUser = (req, res) => {
    let data = req.body
    let size = Object.keys(data).length;
    let rst_data = [];

    for(let i = 0 ; i < size ; i++) {
        let subject = data[i].subject;
        let professor = data[i].professor;

        usersModel.readSubjectUrl(subject, professor, (result) => {
            if (result) {
                console.log("subject url selected", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
                rst_data.push({
                    subject : subject,
                    professor : professor,
                    url : result
                })
                if(i == size -1) {
                    res.send(rst_data)
                }
            }
        })
    }

}