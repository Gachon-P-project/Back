

const axios = require('axios');
const mysql = require('mysql');
const dotenv = require('dotenv').config({ path: '../.env' });
const cheerio = require('cheerio');

const mysqlConObj = require('../config/mysql');
const db = mysqlConObj.init();

// 웹엑스 주소 가져오기
const getWebEx = async (url) => {
    try {
        const res = await axios.get(url);
        const html = res.data;
        let $ = cheerio.load(html)
        let online_url = ''

        $('table:nth-of-type(1)').each((index, data) => {
            online_url = $($(data).find('tr').eq(6)).find('td').text();
        })

        return online_url;
    } catch (e) {
        console.log("getWebEx error : ", e);
    }
}


const select_sql = 'SELECT subject_code, subject_member_code FROM SUBJECT';

db.query(select_sql, async (err, results) => {
    if (err) {
        console.log("SUBJECT SELECT ERROR", err);
    } else {
        for (const elem of results) {
            const year = 2020
            const hakgi = 20
            p_subject_cd = elem.subject_code
            p_member_no = elem.subject_member_code
            const url = "http://sg.gachon.ac.kr/main?attribute=lectPlan&year="+year+"&hakgi="+hakgi+"&p_subject_cd="+p_subject_cd+"&p_member_no="+p_member_no+"&lang=ko"

            try {
                await getWebEx(url).then(webex_url => {
                    // console.log(webex_url);
                    const update_sql = "UPDATE SUBJECT SET subject_url=? WHERE subject_code=?"
                    
                    db.query(update_sql, [webex_url, p_subject_cd], (err, result) => {
                        if(err) console.log("update err : ", err);
                        else console.log("update result : ", result);
                    })
                })
            } catch (e) {
                console.log("select getWebEx error : ", e);
            }
        }
    }
})
