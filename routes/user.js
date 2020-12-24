const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
const userController = require('./../controllers/userController')

const getTimetable = async (url) => {
    const res = await axios.post(url);
    return res.data
} 

// USER CREATE - 새 유저 등록
router.post("/add", userController.createUser)

// 클라이언트에서 로그인한 id / pwd 가 가천대학교 학생으로 등록되어있는지 확인 후
// DB에 등록된 사용자인지 확인한다.
router.post("/info", async (req, res) => {
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

        const sql = "SELECT * FROM USER WHERE user_id = ?";

        try {
            db.query(sql, req.body.id, (err, results) => {
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
        } catch (e) {
            res.send("DB 연결 오류")
        }

    } catch (e) {
        res.send("ID/PW를 확인하세요.")
    }
})

router.get('/timetable/:user_no/:year/:sem', (req, res) => {
    
    const url = process.env.smart_main_link+"YEAR="+req.params.year+"&TERM_CD="+req.params.sem+"&STUDENT_NO="+req.params.user_no+"&GROUP_CD=CS&SQL_ID=mobile%2Faffairs%3ACLASS_TIME_TABLE_STUDENT_SQL_S01&fsp_action=AffairsAction&fsp_cmd=executeMapList&callback_page=%2Fmobile%2Fgachon%2Faffairs%2FAffClassTimeTableList.jsp"
    getTimetable(url).then(html => {
        let $ = cheerio.load(html);
        let day_data = [];
        let last = [];
        try {        
            $('body > li').each((i, data) => {
                let time = [];
                let sub = [];

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
            res.send(e)
        }
    }) 
})

router.get('/nickname_chk/:nickname', (req, res) => {
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


module.exports = router;