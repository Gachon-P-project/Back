const likeModel = require('../models/likeModel');

// LIKE CREATE - 좋아요, 좋아요 취소
// router.post("/insert/:postNo/:userNo", likeController.createLike)
// 클라이언트에서 post_no과 user_no를 파라미터로 전달한다.
// post_no과 user_no는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
// 이미 좋아요 표시한 게시글인 경우 좋아요 취소된다.
exports.createLike = (req, res) => {
    const post_no = req.params.postNo;
    const user_no = req.params.userNo;
    const board_flag = req.params.boardFlag;

    likeModel.createLike(post_no, user_no, board_flag, (result) => {
        if (result) {
            console.log("like completed")
            res.send(result)
        }
    })
}

// LIKE CREATE - 좋아요 개수 조회
// router.get("/read/:postNo", likeController.readLike)
// 클라이언트에서 user_no를 파라미터로 전달한다.
exports.readLike = (req, res) => {
    const post_no = req.params.postNo;
    const board_flag = req.params.boardFlag;

    likeModel.readLike(post_no, board_flag, (result) => {
        if (result) {
            console.log("like read completed")
            res.send(result)
        }
    })
}