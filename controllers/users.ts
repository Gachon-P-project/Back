import { request, Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../entities/User';
import { Subject } from '../entities/Subject';
import { Professor } from '../entities/Professor';
import { isAccessor } from 'typescript';
import cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';


// 사용자 등록
export const createUser = async(req:Request, res:Response) => {
    let user_no = req.body.user_no;
    let user_id = req.body.user_id;
    let user_name = req.body.user_name;
    let nickname = req.body.nickname;
    let user_major = req.body.user_major;
    let auth_level = 0;     // 기본 0, 관리자일 경우 1로 직접 update


    try {
        const userRepository = getRepository(User);
        await userRepository.insert({
            userNo: user_no,
            userId: user_id,
            userName: user_name,
            nickname: nickname,
            userMajor: user_major,
            authLevel: auth_level
        });

        res.status(200).json({ message: "user create success" })
    } catch(err) {
        console.log("insert user err : ", err, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        res.status(404).json({ message: "user create failed" })
    }

}


// 사용자 확인 및 조회
// 클라이언트에서 로그인한 id / pwd 가 가천대학교 학생으로 등록되어있는지 확인 후
// DB에 등록된 사용자인지 확인한다.
export const verifyUser = async(req:Request, res:Response) => {
    try {
        const getUser = await axios.post(<string>process.env.smart_login_link, { 
            fsp_cmd : "login", 
            DVIC_ID : process.env.smart_dvic,
            fsp_action : "UserAction",
            LOGIN_ID : req.body.id,
            USER_ID : req.body.id,
            PWD : req.body.pwd,
            APPS_ID : process.env.smart_apps 
        });

        let user_no: string = "";
        let user_id: string = "";
        let user_name: string = "";
        let user_major: string = "";

        // 로그인 실패하면 에러 생성.
        if(getUser.data.ds_output == null) {
            throw new Error('ID 또는 PW가 일치하지 않습니다.');
        }else {
            user_no = getUser.data.ds_output.userUniqNo;
            user_id = getUser.data.ds_output.userId;
            user_name = getUser.data.ds_output.userNm;
            user_major = getUser.data.ds_output.clubList[0].clubNm
        }

        // DB에서 유저 정보 확인.
        // isExist가 0이면 새로운 유저.
        // 기존 유저이면 findData로 유저 정보 가져옴.
        const userRepository = getRepository(User);
        var [findData, isExist] = await userRepository.findAndCount({ userId: user_id });

        if (isExist == 0){
            let userInfo = {
                user_no : user_no,
                user_id : user_id,
                user_name : user_name,
                user_major : user_major
            }

            // 등록되지 않은 사용자 - nickname 없음
            console.log("VERIFY USER:", user_id, "- NEW USER", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.status(204).json({
                code: 204,
                data: userInfo
            })
        } else {
            let userInfo = {
                user_no : user_no,
                user_id : user_id,
                user_name : user_name,
                user_major : user_major,
                nickname: findData[0].nickname
            };

            // 등록된 사용자 - nickname 추가하여 전송
            console.log("VERIFY USER:", user_id, "- EXISTED USER", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            userInfo
            res.json({
                code: 200,
                data: userInfo
            })

        }
        
    } catch (e) {
        console.log("ERROR in verifyUser:", req.body.id, "- 사용자 확인 및 조회 오류", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
        console.log(e)
        res.send("ID/PW를 확인하세요.")
    }
}


// 닉네임 중복확인
export const getUserNicknameValidity = async(req:Request, res:Response) => {
    const nickname = req.params.nickname;
    console.log(nickname)

    try {
        const userRepository = getRepository(User);
        let isExist = Number(await userRepository.count({ nickname: nickname }))

        if (isExist == 0){
            // 등록되지 않은 사용자 - nickname 없음
            console.log("VALIDATE NICKNAME:", nickname, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send("사용가능한 닉네임 입니다.")
        } else{
            // 등록된 사용자 - nickname 추가하여 전송
            res.send("이미 등록된 닉네임 입니다.")

        }
     
    } catch(err) {
        console.log("ERROR IN getUserNicknameValidity:", nickname, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
        console.log(err)
    }
}


// 닉네임 수정
export const ModifyUserNickname = async(req:Request, res:Response) => {
    let nickname = req.body.nickname;
    let user_no = req.body.user_no;

    try{
        const userRepository = getRepository(User);
        let result = await userRepository.update({ userNo: user_no }, { nickname: nickname })

        if (result.affected == 1) {
            // 제대로 수정되었을 경우
            console.log("USER NICKNAME UPDATE COMPLETED:",user_no, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            res.send("USER NICKNAME UPDATE COMPLETED")
        } else{
            // 수정이 제대로 되지 않은 경우 (affected raw가 0일 경우)
            throw new Error('Update User Nickname Failure\nAffected raw is zero.')
        }
    } catch(err) {
        console.log("ERROR IN getUserNicknameValidity:",user_no, nickname, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
        console.log(err)
    }

}


// 시간표 조회
export const getTimetable = async(req:Request, res:Response) => {
    const url = process.env.smart_main_link+"YEAR="+req.params.year+"&TERM_CD="+req.params.sem+"&STUDENT_NO="+req.params.user_no+"&GROUP_CD=CS&SQL_ID=mobile%2Faffairs%3ACLASS_TIME_TABLE_STUDENT_SQL_S01&fsp_action=AffairsAction&fsp_cmd=executeMapList&callback_page=%2Fmobile%2Fgachon%2Faffairs%2FAffClassTimeTableList.jsp"
    try {
            
        let getData = await axios.post(url)
        let html = getData.data
        let $ = cheerio.load(html)
        let last: Array<any> = [];
        try {
            $('body > li').each((i, data) => {
                let time: Array<any> = [];
                let sub: Array<any> = [];
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

        } catch(err) {

        }
    } catch(err) {
        res.send("시간표 조회 오류")
        console.log("ERROR IN SELECT TIMETABLE:", err)
    }
}


// 수업 url 조회
export const getSubjcetUrl = async(req:Request, res:Response) => {
    let data = req.body
    let size = Object.keys(data).length;
    let rst_data: Array<any> = [];

    console.log("aaaaa")
    for(let i = 0 ; i < size ; i++) {
        let subject = data[i].subject;
        let professor = data[i].professor;

        // let professor_qb = await getRepository(Professor).createQueryBuilder("professor")
        // let subject_url = await getRepository(Subject)
        //     .createQueryBuilder("subjcet")
        //     .select("subject_url")
        //     .where("subject.subject_name like :subject_name", { subject_name: '${subjcet}%'})
        //     .andWhere("subject.subject_member_code IN " + 
        //         professor_qb.subQuery()
        //             .select("professor_code")
        //             .where("professor_name = :name", { name: '${professor}'})
        //     )
        //     .distinct()
        //     .getRawOne();
        let professor_qb = getRepository(Professor).createQueryBuilder("professor")

        // var rst = await professor_qb
        //     .select("p.professor_code")
        //     .from(Professor, "p")
        //     .where("p.professor_name = :name", { name: professor})
        //     .distinct()
        //     .getRawMany()
        // console.log("professor:", rst)

        
        let subject_url = await getRepository(Subject)
            .createQueryBuilder("subject")
            .select("subject.subject_url")
            .where("subject.subject_name like :subject_name")
            .andWhere("subject.subject_member_code IN (" + 
                professor_qb.subQuery()
                    .select("p.professor_code")
                    .from(Professor, "p")
                    .where("p.professor_name = :p_name")
                    .getQuery()
            + ")" ) 
            .setParameter("subject_name", subject+'%')
            .setParameter("p_name", professor)
            // .andWhere("subject.subject_member_code IN " + 
            // professor_qb.subQuery()
            //     .select("p.professor_code")
            //     .from(Professor, "p")
            //     .where("p.professor_name = :name", { name: professor})
            //     .getQuery()
            // )  
            // .andWhere(professor_qb => {
            //     const subQuery = professor_qb.subQuery()
            //         .select("p.professor_name")
            //         .from(Professor, "p")
            //         .where("p.professor_name = :p_name", { p_name: professor })
            //         .getQuery();
            //     return "subject.subject_member_code IN " + subQuery;
            // })
            .distinct()
            .getRawOne();

        console.log(subject_url)
        if (subject_url) {
            console.log("subject url selected", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}))
            rst_data.push({
                subject: subject,
                professor: professor,
                url: subject_url.subject_url
            })
            if (i == size - 1){
                res.send(rst_data)
            }
        }
    }
    
}


// 푸시 메세지
export const postPushMessage = async(req:Request, res:Response) => {
    
}
