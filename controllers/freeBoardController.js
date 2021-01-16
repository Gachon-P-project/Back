const freeBoardModel = require('../models/freeBoardModel');

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
            board_flag: 1,
            user_no: req.body.user_no
        };
    } else {
        dataObj = {
            post_title: req.body.post_title,
            post_contents: req.body.post_contents,
            wrt_date: new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}),
            reply_yn: 0,
            board_flag: 1,
            user_no: req.body.user_no
        };
    }

    freeBoardModel.createBoard(dataObj, (result) => {
        if (result) {
            console.log("free board create completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
            res.send(result)
        }
    })
}

// 전체 게시글 조회
// 클라이언트에서 board_flag를 파라미터로 전달하면 해당하는 튜플을 전송
exports.readList = (req, res) => {
    let board_flag = req.params.boardFlag;
    let user_no = req.params.userNo;
    let page_num = req.params.page_num;
    if (page_num >= 1) {
        page_num *= 10;
    }

    if (board_flag == 1) {
        freeBoardModel.readList(board_flag, user_no, page_num, (result) => {
            if (result) {
                console.log("free board select completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
                res.send(result)
            }
        })
    }
}

// 특정 게시글 조회
// 클라이언트에서 board_flag/특정값을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readSomeList = (req, res) => {
    let board_flag = req.params.boardFlag;
    let user_no = req.params.userNo;
    let post_word = req.params.word;
    let page_num = req.params.page_num;
    if (page_num >= 1) {
        page_num *= 10;
    }

    
    freeBoardModel.readSomeList(board_flag, user_no, post_word, page_num, (result) => {
        if (result) {
            console.log("free board select completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
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
    let post_no = req.body.post_no;
    
    freeBoardModel.updateBoard(post_title, post_contents, post_no, (result) => {
        if (result) {
            console.log("free board update completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// 게시글 삭제
// 클라이언트에서 post_no을 전달하면 해당 튜플을 삭제한다.
exports.deleteBoard = (req, res) => {
    let post_no = req.params.post_no;
    
    freeBoardModel.deleteBoard(post_no, (result) => {
        if (result) {
            console.log("free board delete completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

