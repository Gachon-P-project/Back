const boardModel = require('../models/boardModel');

// 과목게시판 전체 글 조회
// 클라이언트에서 과목명/교수명을 파라미터로 전달하면 해당하는 튜플을 전송
exports.readList = (req, res) => {
    let subject_name = req.params.subject;
    let professor_name = req.params.professor;
    
    boardModel.readList(subject_name, professor_name, (result) => {
        if (result) {
            console.log("board select completed")
            res.send(result)
        }
    })
}

// BOARD CREATE - 과목게시판 새 글 작성
// 클라이언트는 body에 post_title, post_contents, reply_yn, major_name, subject_name, professor_name, user_id를 전달
exports.createBoard = (req, res) => {
    const dataObj = {
        post_title: req.body.post_title,
        post_contents: req.body.post_contents,
        post_like: 0,
        wrt_date: new Date(),
        view_cnt: 1,
        reply_yn: req.body.reply_yn,
        major_name: req.body.major_name,
        subject_name: req.body.subject_name,
        professor_name: req.body.professor_name,
        user_id: req.body.user_id
    };
    
    boardModel.createBoard(dataObj, (result) => {
        if (result) {
            console.log("board create completed")
            res.send(result)
        }
    })
}

// BOARD UPDATE - 과목게시판 내 선택한 글 수정     
// 클라이언트에서 post_no을 파라미터로 전달하면 해당 튜블의 post_title, post_contents를 수정한다.
// 수정할 글 제목과 글 내용은 body를 통해 전달된다.
exports.updateBoard = (req, res) => {
    let post_title = req.body.post_title;
    let post_contents = req.body.post_contents;
    let post_no = req.params.id
    
    boardModel.updateBoard(post_title, post_contents, post_no, (result) => {
        if (result) {
            console.log("board update completed")
            res.send(result)
        }
    })
}

// BOARD DELETE - 과목게시판 내 선택한 글 삭제
// 클라이언트에서 post_no을 전달하면 해당 튜플을 삭제한다.
exports.deleteBoard = (req, res) => {
    let post_no = req.params.id
    
    boardModel.deleteBoard(post_no, (result) => {
        if (result) {
            console.log("board delete completed")
            res.send(result)
        }
    })
}

// BOARD READ - 과목게시판 특정 단어로 글 조회
// 클라이언트에서 과목명/특정값을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readSomeList = (req, res) => {
    let subject_name = req.params.subject;
    let professor_name = req.params.professor;
    let post_word = req.params.word;
    
    boardModel.readSomeList(subject_name, professor_name, post_word, (result) => {
        if (result) {
            console.log("board select completed")
            res.send(result)
        }
    })
}

// BOARD READ - 과목게시판 내 선택한 글 상세보기
// 클라이언트에서 post_no을 전달하면 해당 튜플을 전송한다.
exports.readDetailBoard = (req, res) => {
    let post_no = req.params.id
    
    boardModel.readDetailBoard(post_no, (result) => {
        if (result) {
            console.log("board select completed")
            res.send(result)
        }
    })
}