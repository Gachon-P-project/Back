// 테이블 생성
/*
    CREATE TABLE `SUBJECT` (
    `subject_no` int NOT NULL AUTO_INCREMENT,
    `subject_code` varchar(30) NOT NULL,
    `subject_name` varchar(70) NOT NULL,
    `major_names` varchar(100) NOT NULL,
    PRIMARY KEY (`subject_no`),
    UNIQUE KEY `subject_code_UNIQUE` (`subject_code`)
    ) ENGINE=InnoDB AUTO_INCREMENT=7128 DEFAULT CHARSET=utf8;
*/

const axios = require('axios');
const mysql = require('mysql');
const dotenv = require('dotenv').config({ path: './../.env' });
const cheerio = require('cheerio')
// DB 연결
const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();
mysqlConObj.open(db);

// getData : 가천대 시간표 조회에서 데이터 가져오기
async function getData(url) {
    try {
        console.log(url);
        return await axios.get(url);
    } catch (e) {
        console.log("getData error : ", e);
    }
}

// IT융합
const it_convergence_1 = ["CS0200", "컴퓨터공학과", ""]
const it_convergence_2 = ["CS1205", "소프웨어학과/AI소프트웨어학부(소프트웨어전공)", ""]
const it_convergence_3 = ["CS0190", "전자공학과", ""]
const it_convergence_4 = ["CS1240", "전기공학과", ""]
const it_convergence_5 = ["CS0230", "에너지IT학과", ""]
const it_convergence_6 = ["CS2130", "AI소프트웨어학부(인공지능전공)", ""]

// 사회과학
const social_science_1=["CE0140","행정학과", ""]
const social_science_2=["CE0320","미디어커퓨니케이션/언론영상광고/신문방송", ""]
const social_science_3=["CE2140","관광경영학과", ""]
const social_science_4=["CE0122","글로벌경제학과/경제학과", ""]
const social_science_5=["CE0275","헬스케어경영/의료경영학", ""]
const social_science_6=["CE0240","응용통계학과", ""]
const social_science_7=["CE1290","사회복지학과", ""]
const social_science_8=["CE0260","유아교육학과", ""]

// 경영
const business_1=["CP0110","경영학과/경영트랙", ""]
const business_2=["CP0130","경영학부", ""]
const business_3=["CP0140","경영학부(글로벌경영)", ""]
const business_4=["CP0610","금융수학과/수학금융정보학과/수리정보학과", ""]

// 인문
const humanities_union_1=["C12110","한국어문학과/국어국문학과", ""]
const humanities_union_2=["C12130","영미어문학과/영어영문학과", ""]
const humanities_union_3=["C12170","동양어문학과/중국어문학과/중어중문학과/일본어문학과", ""]
const humanities_union_4=["C12180","유럽문어학과/독어독문학과/독일어문학과/불어불문학과/프랑스문학과", ""]

// 법과
const law_union_1=["CL0110","법학과", ""]
const law_union_2=["CL0160","경찰안보학과", ""]
const law_union_3=["CL1150","경찰학연계전공", ""]

// 공과
const engineering_1=["C61120","도시계획조경학부/도시계획학과/조경학과/조경학전공", ""]
const engineering_2=["C60240","도시계획학전공", ""]
const engineering_3=["C60220","실내건축학과/실내건축학전공", ""]
const engineering_4=["C61230","건축학부/건축학과/건축학전공/건축공학과", ""]
const engineering_5=["C60735","설비플랜트소방방재공학과/설비소방공학과/소방방재공학과", ""]
const engineering_6=["C61280","화공생명공학과", ""]
const engineering_7=["C60550","신소재공학과", ""]
const engineering_8=["C60685","기계공학과/기계자동차공학과", ""]
const engineering_9=["C60530","토목환경공학과", ""]
const engineering_10=["C60545","산업경영공학과", ""]
const engineering_11=["C60230","식품생물공학과", ""]

// 바이오나노
const bionano_1=["CK0130","영양학과/식품영양학과", ""]
const bionano_2=["CK1200","바이오나노학과", ""]
const bionano_3=["CK1210","생명과학과", ""]
const bionano_4=["CK1230","나노물리학과/물리학과", ""]
const bionano_5=["CK1240","나노화학과/화학과", ""]

// 한의과
const oriental_medicine_1=["C50110","한의예과/한의학과", ""]

// 예술·체육
const arts_sports_1=["CT4120","미술디자인학부(회화·조소)", ""]
const arts_sports_2=["CT4130","미술디자인학부(시각디자인)/미술디자인학부(디자인)/미술디자인학부(산업디자인)", ""]
const arts_sports_3=["CT4150","미술디자인학부(패션디자인)", ""]
const arts_sports_4=["CT5120","음악학부(성악)", ""]
const arts_sports_5=["CT5130","음악학부(기악)", ""]
const arts_sports_6=["CT5140","음악학부(작곡)", ""]
const arts_sports_7=["CT6120","체육학부(체육)", ""]
const arts_sports_8=["CT6130","체육학부(태권도)", ""]
const arts_sports_9=["CT7110","연기예술학과", ""]

// 간호
const nursing_1=["Y51110","간호학과", ""]

// 보건과학
const health_sciences_1=["Y54120","치위생과", ""]
const health_sciences_2=["Y54130","응급구조학과", ""]
const health_sciences_3=["Y54140","방사선학과", ""]
const health_sciences_4=["Y54150","물리치료학과", ""]
const health_sciences_5=["Y54170","의용생체공학과", ""]
const health_sciences_6=["Y54160","운동재활복지학과", ""]

// 약학
const pharmacy_1=["Y53110","약학과", ""]

// 의과
const medical_1=["Y55110","의예과", ""]
const medical_2=["Y55120","의학과", ""]

// 가천리버럴아츠칼리지
const liberal_1=["CM3150", "가천리버럴아츠칼리지", ""]
const liberal_2=["CM4130", "미디어 컴퓨터 융합 연계 전공", ""]
const liberal_3=["CM4170", "인지과학 부전공", ""]
const liberal_4=["CM4180", "디지털엔터테인먼트 부전공", ""]
const liberal_5=["CM4190", "지능형 데이터 분석 및 보안 융합(연계)전공", ""]
const liberal_6=["CM4200", "화장품공학 융합(연계)전공", ""]

// 교양
const culture_1=["CE0160", "교직이론영역", "010"]
const culture_2=["CE0160", "교과교육영역", "011"]
const culture_3=["CE0160", "교육실습영역", "012"]
const culture_4=["CE0160", "[융합]인간과예술", "101"]
const culture_5=["CE0160", "[융합]사회와역사", "102"]
const culture_6=["CE0160", "[융합]자연과과학", "103"]
const culture_7=["CE0160", "[융합]세계와언어", "104"]
const culture_8=["CE0160", "[계교]인문사회과학", "105"]
const culture_9=["CE0160", "[계교]자연과학", "106"]
const culture_10=["CE0160", "[계교]예체능", "107"]
const culture_11=["CE0160", "[기초]인성과리더쉽", "108"]
const culture_12=["CE0160", "[기초]의사소통", "110"]
const culture_13=["CE0160", "[기초]창의와사고", "112"]
const culture_14=["CE0160", "일반교양", "115"]
const culture_15=["CE0160", "[기초]소프트웨어기초", "119"]
const culture_16=["CE0160", "군사학", "999"]


const major = [
    {
        "name": "it_convergence_",
        "size": 6
    },
    {
        "name": "social_science_",
        "size": 8
    },
    {
        "name": "business_",
        "size": 4
    },
    {
        "name": "humanities_union_",
        "size": 4
    },
    {
        "name": "law_union_",
        "size": 3
    },
    {
        "name": "engineering_",
        "size": 11
    },
    {
        "name": "bionano_",
        "size": 5
    },
    {
        "name": "oriental_medicine_",
        "size": 1
    },
    {
        "name": "arts_sports_",
        "size": 9
    },
    {
        "name": "nursing_",
        "size": 1
    },
    {
        "name": "health_sciences_",
        "size": 6
    },
    {
        "name": "pharmacy_",
        "size": 1
    },
    {
        "name": "medical_",
        "size": 2
    },
    {
        "name": "liberal_",
        "size": 6
    },
    {
        "name": "culture_",
        "size": 16
    },
]

for(i=0; i<=14; i++) {
// for(i=14; i<=14; i++) {
    
    // console.log(i, subject[i].name);

    let dataObject = new Array()

    for(j=1; j<=major[i].size; j++) {
        let p_maj_cd = eval(major[i].name+j)[0]
        let major_names = eval(major[i].name+j)[1]
        let p_cor_cd = eval(major[i].name+j)[2]
        let p_isu_cd = 1
        if (i == 14) {
            p_isu_cd = 2
        }

        console.log(p_maj_cd, major_names);

        const url = "http://sg.gachon.ac.kr/main?attribute=timeTableJson&lang=ko&year=2020&hakgi=20&menu=1&p_isu_cd="+p_isu_cd+"&p_univ_cd=CS0000&p_maj_cd="+p_maj_cd+"&p_cor_cd="+p_cor_cd+"&p_gwamok_nm=%EA%B3%BC%EB%AA%A9%EB%AA%85%EC%9D%84%202%EC%9E%90%EB%A6%AC%20%EC%9D%B4%EC%83%81%20%EC%9E%85%EB%A0%A5%ED%95%98%EC%84%B8%EC%9A%94.&p_p_hakgi=&p_group_cd=&lang=ko&initYn=Y&fake=Sat%20Dec%2005%202020%2002:14:34%20GMT+0900%20(%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%20%ED%91%9C%EC%A4%80%EC%8B%9C)&_search=false&nd=1607102074769&rows=-1&page=1&sidx=&sord=asc"
        getData(url)
        .then(result => {
            result.data.rows.map(data => {
                dataObject.push({
                    "subject_code": data.subject_cd,
                    "subject_name": data.subject_nm_kor,
                    "major_names": major_names,
                    "subject_member_code" : data.member_no
                })
            })

            const sql = "INSERT INTO SUBJECT SET ?"
            dataObject.map(data => {
                db.query(sql, data, (err, result) => {
                    if(err) console.log("insert err : ", err);
                    else console.log("insert result : ", result);
                })
            })
        })
        
    }
}