const likesModel = require('../models/likesModel');

// LIKE CREATE - 좋아요, 좋아요 취소
// router.post("/insert/:postNo/:userNo", likeController.createLike)
// 클라이언트에서 post_no과 user_no를 파라미터로 전달한다.
// post_no과 user_no는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
// 이미 좋아요 표시한 게시글인 경우 좋아요 취소된다.
exports.createLike = (req, res) => {
    const post_no = req.body.post_no;
    const user_no = req.body.user_no;
    const board_flag = req.body.board_flag;

    likesModel.createLike(post_no, user_no, board_flag, (result) => {
        if (result) {
            console.log("like/unlike completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}

// LIKE CREATE - 좋아요 개수 조회
// router.get("/read/:postNo", likeController.readLike)
// 클라이언트에서 user_no를 파라미터로 전달한다.
exports.readLike = (req, res) => {
    const post_no = req.params.post_no;

    likesModel.readLike(post_no, (result) => {
        if (result) {
            console.log("like read completed", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send(result)
        }
    })
}