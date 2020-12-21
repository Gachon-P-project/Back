const userModel = require('../models/userModel');

// USER CREATE - 새 유저 등록
// user_id가 기본키로 등록되어 이미 등록된 사용자는 중복 등록되지 않는다.
exports.createUser = (req, res) => {
    let user_no = req.body.user_no;
    let user_id = req.body.user_id;
    let user_name = req.body.user_name;
    let nickname = req.body.nickname;
    let user_major = req.body.user_major;
    let auth_level = 0;     // 기본 0, 관리자일 경우 1로 직접 update

    userModel.createUser(user_no, user_id, user_name, nickname, user_major, auth_level, (result) => {
        if (result) {
            console.log("user insert completed")
            res.send(result)
        }
    })
}