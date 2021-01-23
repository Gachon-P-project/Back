const boardsModel = require('../models/boardsModel');

// 게시글 작성
// 클라이언트는 body에 post_title, post_contents, reply_yn, major_name, subject_name, professor_name, user_no를 전달
exports.createBoard = (req, res) => {
    let dataObj;
    if (req.query.reply_yn) {
        dataObj = {
            post_title: req.body.post_title,
            post_contents: req.body.post_contents,
            wrt_date: new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}),
            reply_yn: 1,
            major_name: req.body.major_name,
            subject_name: req.body.subject_name,
            professor_name: req.body.professor_name,
            user_no: req.body.user_no
        };
    } else {
        dataObj = {
            post_title: req.body.post_title,
            post_contents: req.body.post_contents,
            wrt_date: new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}),
            reply_yn: 0,
            major_name: req.body.major_name,
            subject_name: req.body.subject_name,
            professor_name: req.body.professor_name,
            user_no: req.body.user_no
        };
    }
    
    boardsModel.createBoard(dataObj, (result) => {
        if (result) {
            console.log(dataObj.subject_name, "boards create completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
            res.send(result)
        }
    })
}

// 전체 게시글 조회
// 클라이언트에서 과목명/교수명을 파라미터로 전달하면 해당하는 튜플을 전송
exports.readList = (req, res) => {
    let subject_name = req.params.subject;
    let professor_name = req.params.professor;
    let user_no = req.params.user_no;
    let page_num = req.params.page_num;
    if (page_num >= 1) {
        page_num *= 10;
    }
    
    boardsModel.readList(user_no, subject_name, professor_name, page_num, (result) => {
        if (result) {
            console.log(subject_name, "boards select completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// 특정 게시글 조회
// 클라이언트에서 과목명/특정값을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readSomeList = (req, res) => {
    let subject_name = req.params.subject;
    let professor_name = req.params.professor;
    let user_no = req.params.user_no;
    let post_word = req.params.word;
    let page_num = req.params.page_num;
    if (page_num >= 1) {
        page_num *= 10;
    }
    
    boardsModel.readSomeList(user_no, subject_name, professor_name, post_word, page_num, (result) => {
        if (result) {
            console.log(subject_name, "board select completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}


// 게시글 수정
// 클라이언트에서 post_no을 파라미터로 전달하면 해당 튜블의 post_title, post_contents를 수정한다.
// 수정할 글 제목과 글 내용은 body를 통해 전달된다.
exports.updateBoard = (req, res) => {
    let post_title = req.body.post_title;
    let post_contents = req.body.post_contents;
    let post_no = req.body.post_no
    
    boardsModel.updateBoard(post_title, post_contents, post_no, (result) => {
        if (result) {
            console.log(post_no, "board update completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// 게시글 삭제
// 클라이언트에서 post_no을 전달하면 해당 튜플을 삭제한다.
exports.deleteBoard = (req, res) => {
    let post_no = req.params.post_no
    
    boardsModel.deleteBoard(post_no, (result) => {
        if (result) {
            console.log(post_no, "board delete completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// MY BOARD READ - 과목게시판 내가 쓴 글 조회
// router.get("/select/myBoard/:userNo", boardController.readMyBoardList)
// 클라이언트에서 userNo을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readMyBoardList = (req, res) => {
    let user_no = req.params.userNo;
    
    boardModel.readMyBoardList(user_no, (result) => {
        if (result) {
            console.log("my board select completed")
            res.send(result)
        }
    })
}

/*
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
*/