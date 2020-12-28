const likeModel = require('../models/likeModel');

// LIKE CREATE - 좋아요
// router.post("/insert/:postNo/:userNo", likeController.createLike)
// 클라이언트에서 post_no과 user_no를 파라미터로 전달한다.
// post_no과 user_no는 외래키로 지정되어 유효하지 않은 값이 전달되면 에러가 발생한다.
exports.createLike = (req, res) => {
    const dataObj = {
        post_no : req.params.postNo,
        user_no : req.params.userNo
    }

    likeModel.createLike(dataObj, (result) => {
        if (result) {
            console.log("like insert completed")
            res.send(result)
        }
    })
}