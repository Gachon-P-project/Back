const dotenv = require('dotenv').config();
const mysqlConObj = require('./config/mysql');
const db = mysqlConObj.init();
const axios = require('axios');
const cheerio = require('cheerio');

let start = new Date();

const postPush = async (major_code, cur_recent_title) => {
  try {
    console.log("postPush", major_code);
    const dataObj = {
      major_code: major_code,
      title: cur_recent_title
    }

    const res = await axios.post("http://localhost:17394/user/push/", dataObj);
    return res.data
  } catch (e) {
    console.log("postPush error", e);
  }
}

const getFirstTitle = async (url) => {
  try{
  const res = await axios.get(url);
  const html = res.data;
  let dataObj;
  let dataList = [];

  let $ = cheerio.load(html);

  try {
    $('.boardlist table tbody tr').each((index, data) => {
      const td = $(data).find('td');
      dataObj = {
        num : '',
        title : '',
      }
        td.each((i, element) => {
          if(i == 0) {
            dataObj.num = $(element).text().trim()
          }
          if(i == 1) {
            dataObj.title = $(element).text().trim();
          }
          
        })
        dataList.push(dataObj)
    })
    const first_title = dataList.find(element => element.num != '').title;  // [공지] 태그가 없는 게시글 중 가장 첫 번째 게시글
    return first_title;
  } catch (e) {
    console.log("e");
  }
}
catch (e) {
  console.log("Aa");
}}


const sql = "SELECT distinct major_code FROM MAJOR ORDER BY major_code;"

db.query(sql, async (err, results) => {
    if (err) {
        console.log("학과 코드 조회 실패")
    }
    else {
      for (const element of results) {
        let boardType_seq = element.major_code;

        const url = process.env.notice_link+"boardType_seq="+boardType_seq
        try{
          await getFirstTitle(url).then(result => {
            const cur_recent_title = result  // 새로 크롤링한 학과 공지사항의 최근 게시글

            const sql2 = "SELECT recent_title FROM RECENT where major_code=?"
            db.query(sql2, boardType_seq, async (err, res) => {
              const pre_recent_title = res[0].recent_title;

              if(err){
                console.log(err);
              }
              else {
                if(cur_recent_title != pre_recent_title){
                  console.log("새 글 탐지", boardType_seq);
                  await postPush(boardType_seq, cur_recent_title)
                  
                  // const sql3 = "UPDATE RECENT SET recent_title=? WHERE major_code=?;"
                  // db.query(sql3, [cur_recent_title, boardType_seq], (err, res) => {
                  //   if(err) {
                  //     console.log(e);
                  //   }
                  // })
                }
              }
            })
          })
        } catch (e) {
          console.log("ERROR", boardType_seq);
        }
      }

      // 시간 복잡도 계산 - 8~9초
      let end = new Date();
      console.log(end-start);

      db.destroy();
      process.exit();
    }
})