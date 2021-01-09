const majorBoardModel = require('../models/majorBoardModel');

// MAJOR BOARD CREATE - 학과게시판 새 글 작성
// 클라이언트는 body에 post_title, post_contents, reply_yn, user_no를 전달
exports.createBoard = (req, res) => {
    const dataObj = {
        post_title: req.body.post_title,
        post_contents: req.body.post_contents,
        wrt_date: new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}),
        reply_yn: req.body.reply_yn,
        board_flag: 2,
        major_name: req.body.major_name,
        user_no: req.body.user_no
    };
    
    majorBoardModel.createBoard(dataObj, (result) => {
        if (result) {
            console.log("major board create completed")
            res.send(result)
        }
    })
}

// MAJOR BOARD READ - 학과게시판 글 조회
// boardflag에 맞는 게시글 조회 (0:자유게시판)
exports.readList = (req, res) => {
    let board_flag = req.params.boardFlag;
    let user_no = req.params.userNo;
    if (board_flag == 2) {
        majorBoardModel.readList(board_flag, user_no, (result) => {
            if (result) {
                console.log("major board select completed")
                res.send(result)
            }
        })
    }
}

// MAJOR BOARD READ - 학과게시판 특정 단어로 글 조회
// 클라이언트에서 과목명/특정값을 파라미터로 전달하면 해당하는 튜플을 전송한다.
exports.readSomeList = (req, res) => {
    let board_flag = req.params.boardFlag;
    let user_no = req.params.userNo;
    let post_word = req.params.word;
    
    majorBoardModel.readSomeList(board_flag, user_no, post_word, (result) => {
        if (result) {
            console.log("major board select completed")
            res.send(result)
        }
    })
}

// MAJOR BOARD UPDATE - 학과게시판 내 선택한 글 수정     
// 클라이언트에서 post_no을 파라미터로 전달하면 해당 튜블의 post_title, post_contents를 수정한다.
// 수정할 글 제목과 글 내용은 body를 통해 전달된다.
exports.updateBoard = (req, res) => {
    let post_title = req.body.post_title;
    let post_contents = req.body.post_contents;
    let post_no = req.params.postNo;
    
    majorBoardModel.updateBoard(post_title, post_contents, post_no, (result) => {
        if (result) {
            console.log("major board update completed")
            res.send(result)
        }
    })
}

// MAJOR BOARD DELETE - 학과게시판 내 선택한 글 삭제
// 클라이언트에서 post_no을 전달하면 해당 튜플을 삭제한다.
exports.deleteBoard = (req, res) => {
    let post_no = req.params.postNo;
    
    majorBoardModel.deleteBoard(post_no, (result) => {
        if (result) {
            console.log("major board delete completed")
            res.send(result)
        }
    })
}

// MAJOR BOARD READ - 학과게시판 내가 쓴 글 조회
// router.get("/select/myBoard/:userNo", boardController.readMyBoardList)
// 클라이언트에서 userNo을 파라미터로 전달하면 해당하는 튜플을 전송한다.
// exports.readMyBoardList = (req, res) => {
//     let user_no = req.params.userNo;
    
//     boardModel.readMyBoardList(user_no, (result) => {
//         if (result) {
//             console.log("my board select completed")
//             res.send(result)
//         }
//     })
// }
