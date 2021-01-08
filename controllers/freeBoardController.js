const freeBoardModel = require('../models/freeBoardModel');

// FREE BOARD CREATE - 자유게시판 새 글 작성
// 클라이언트는 body에 post_title, post_contents, reply_yn, user_no를 전달
exports.createBoard = (req, res) => {
    const dataObj = {
        post_title: req.body.post_title,
        post_contents: req.body.post_contents,
        wrt_date: new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}),
        reply_yn: req.body.reply_yn,
        board_flag: 0,
        user_no: req.body.user_no
    };
    
    freeBoardModel.createBoard(dataObj, (result) => {
        if (result) {
            console.log("free board create completed")
            res.send(result)
        }
    })
}

// FREE BOARD READ - 자유게시판 글 조회
// boardflag에 맞는 게시글 조회
exports.readList = (req, res) => {
    let user_no = 201739423;
    // let user_no = req.body.userNo;
    let board_flag = 1;
    // let board_flag = req.body.boardFlag;
    console.log("여기까진 온다");
    if (board_flag == 1) {
        freeBoardModel.readList(user_no, (result) => {
            if (result) {
                console.log("free board select completed")
                res.send(result)
            }
        })
    }
}

// BOARD READ - 과목게시판 특정 단어로 글 조회
// 클라이언트에서 과목명/특정값을 파라미터로 전달하면 해당하는 튜플을 전송한다.
// exports.readSomeList = (req, res) => {
//     let subject_name = req.params.subject;
//     let professor_name = req.params.professor;
//     let user_no = req.params.userNo;
//     let post_word = req.params.word;
    
//     boardModel.readSomeList(user_no, subject_name, professor_name, post_word, (result) => {
//         if (result) {
//             console.log("board select completed")
//             res.send(result)
//         }
//     })
// }

// FREE BOARD UPDATE - 자유게시판 내 선택한 글 수정     
// 클라이언트에서 post_no을 파라미터로 전달하면 해당 튜블의 post_title, post_contents를 수정한다.
// 수정할 글 제목과 글 내용은 body를 통해 전달된다.
exports.updateBoard = (req, res) => {
    let post_title = req.body.post_title;
    let post_contents = req.body.post_contents;
    let post_no = req.params.postNo;
    
    freeBoardModel.updateBoard(post_title, post_contents, post_no, (result) => {
        if (result) {
            console.log("board update completed")
            res.send(result)
        }
    })
}

// FREE BOARD DELETE - 자유게시판 내 선택한 글 삭제
// 클라이언트에서 post_no을 전달하면 해당 튜플을 삭제한다.
exports.deleteBoard = (req, res) => {
    let post_no = req.params.postNo;
    
    freeBoardModel.deleteBoard(post_no, (result) => {
        if (result) {
            console.log("board delete completed")
            res.send(result)
        }
    })
}

// MY BOARD READ - 과목게시판 내가 쓴 글 조회
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