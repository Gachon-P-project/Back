const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
const usersController = require('../controllers/usersController')

const getTimetable = async (url) => {
    const res = await axios.post(url);
    return res.data
} 

// 사용자 등록
router.post("/", usersController.createUser)

// 사용자 확인 및 조회
// 클라이언트에서 로그인한 id / pwd 가 가천대학교 학생으로 등록되어있는지 확인 후
// DB에 등록된 사용자인지 확인한다.
router.post("/check", async (req, res) => {
    try {
        const getUser = await axios.post(process.env.smart_login_link, { 
            fsp_cmd : "login", 
            DVIC_ID : process.env.smart_dvic,
            fsp_action : "UserAction",
            LOGIN_ID : req.body.id,
            USER_ID : req.body.id,
            PWD : req.body.pwd,
            APPS_ID : process.env.smart_apps 
        });

        const userInfo = {
            user_no : getUser.data.ds_output.userUniqNo,
            user_id : getUser.data.ds_output.userId,
            user_name : getUser.data.ds_output.userNm,
            user_major : getUser.data.ds_output.clubList[0].clubNm,
        }

        // 학과명 확인
        // major_code_uv = getUser.data.ds_output.affiCd;
        // const major_sql = "SELECT * FROM MAJOR WHERE major_code_uv = ?;"

        // 닉네임 확인
        const nickname_sql = "SELECT * FROM USER WHERE user_id = ?";

        db.query(nickname_sql, req.body.id, (err, results) => {
            if (err) {
                res.send(err);
            } else {
                if (results.length == 0){
                    // 등록되지 않은 사용자 - nickname 없음
                    res.json({
                        code: 204,
                        data: userInfo
                    })
                } else {
                    // 등록된 사용자 - nickname 추가하여 전송
                    userInfo.nickname = results[0].nickname;
                    res.json({
                        code: 200,
                        data: userInfo
                    })
                }
            }
        })
        // try {
        //     db.query(major_sql, major_code_uv, (err, result) => {
        //         if (err) {
        //             res.send(err);
        //         } else {
        //             userInfo.major_name = result[0].major_name;

        //             // 닉네임 확인
        //             const nickname_sql = "SELECT * FROM USER WHERE user_id = ?";

        //             db.query(nickname_sql, req.body.id, (err, results) => {
        //                 if (err) {
        //                     res.send(err);
        //                 } else {
        //                     if (results.length == 0){
        //                         // 등록되지 않은 사용자 - nickname 없음
        //                         res.json({
        //                             code: 204,
        //                             data: userInfo
        //                         })
        //                     } else {
        //                         // 등록된 사용자 - nickname 추가하여 전송
        //                         userInfo.nickname = results[0].nickname;
        //                         res.json({
        //                             code: 200,
        //                             data: userInfo
        //                         })
        //                     }
        //                 }
        //             })
        //         }
                
        //     })
        // } catch (e) {
        //     res.send("DB 연결 오류")
        // }
    } catch (e) {
        console.log(req.body.id, "사용자 확인 및 조회 오류", e);
        res.send("ID/PW를 확인하세요.")
    }
})

// 시간표 조회
router.get('/timetable/:user_no/:year/:sem', (req, res) => {
    const url = process.env.smart_main_link+"YEAR="+req.params.year+"&TERM_CD="+req.params.sem+"&STUDENT_NO="+req.params.user_no+"&GROUP_CD=CS&SQL_ID=mobile%2Faffairs%3ACLASS_TIME_TABLE_STUDENT_SQL_S01&fsp_action=AffairsAction&fsp_cmd=executeMapList&callback_page=%2Fmobile%2Fgachon%2Faffairs%2FAffClassTimeTableList.jsp"
    
    getTimetable(url).then(html => {
        let $ = cheerio.load(html);
        let last = [];
        try {        
            $('body > li').each((i, data) => {
                let time = [];
                let sub = [];
                let day_data = [];

                $(data).find('ul > li > p').each((i, data) =>{
                    if((i % 2) == 0){
                        time.push($(data).find('strong').text())
                    } else {
                        sub.push($(data).text());
                    }
                })

                for (i=0; i<time.length; i++) {
                    day_data.push({
                        subject : sub[i],
                        time : time[i]
                    })
                }

                const day = $(data).find('a').text()
                last.push({
                    day: day,
                    data: day_data
                })
            })
            res.send(last);
        } catch(e) {
            res.send("시간표 조회 오류")
            console.log("ERROR IN SELECT TIMETABLE:", e)
        }
    }) 
})

// 수업 url 조회
router.post('/subject-url', usersController.getSubjcetUrlUser)

// 닉네임 수정
router.put("/nickname", usersController.nicknameUpdateUser)


// 닉네임 중복확인
router.get('/nickname/check/:nickname', (req, res) => {
    const sql = "SELECT nickname FROM USER where nickname = ?;";

    try{
        try {
            db.query(sql, req.params.nickname, (err, results) => {
                if (err) {
                    res.send(err);
                } else {
                    if (results.length == 0){
                        // 등록되지 않은 사용자 - nickname 없음
                        res.send("사용가능한 닉네임 입니다.")
                    } else {
                        // 등록된 사용자 - nickname 추가하여 전송
                        res.send("이미 등록된 닉네임 입니다.")
                    }
                }
            })
        } catch (e) {
            res.send("DB 연결 오류")
        }
    } catch (e) {
        res.send("닉네임 값 오류")
    }
})

router.post('/push', (req, res) => {
    try{
        const major_code = req.body.major_code
        const req_title = req.body.title
        const req_num = req.body.num

        const major_select_sql = "SELECT major_name FROM MAJOR where major_code=?;"
        db.query(major_select_sql, major_code, (err, results) => {
            for (const result of results) {
                const major_name = result.major_name

                let title = "["+major_name+"]"
                let body = req_title
                let num = req_num

                const token_select_sql = "SELECT token FROM TOKEN where user_major = ?;"
                db.query(token_select_sql, major_name, (err, results) => {
                    if (results.length > 0) {  // 조회된 값이 있는 경우
                        for(const result of results) {
                            pushMessage(result.token, title, body, num)
                        }
                    }
                })
            }
        })

        res.send("push OK")
    } catch (e) {
        console.log("push error: ", e);
        res.send("push error: ", e);
    }
})

const admin = require("firebase-admin");
const serviceAccount = require("../service_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const pushMessage = (token, title, body, num) => {
    try {
        admin.messaging().send({
            data: {
                title: title,
                body: body,
                num: num
            },
            token: token
        })
          .then(res => {
              console.log("Successfully sent with response: ", res, token);
          })
    } catch (e) {
        console.log("pushMessage error", e);
    }
}

module.exports = router;