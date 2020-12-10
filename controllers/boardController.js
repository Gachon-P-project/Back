const boardModel = require('../models/boardModel');

// 과목게시판 전체 글 조회
// 클라이언트에서 과목명/교수명을 파라미터로 전달하면 해당하는 튜플을 전송
exports.getList = (req, res) => {
    let subject_name = req.params.subject;
    let professor_name = req.params.professor;
    
    boardModel.getList(subject_name, professor_name, (result) => {
        if (result) {
            console.log("board select completed")
            res.send(result)
        }
    })
}