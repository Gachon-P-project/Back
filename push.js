// const dotenv = require('dotenv').config();
// const mysqlConObj = require('./config/mysql');
// const db = mysqlConObj.init();
// const axios = require('axios');
// const cheerio = require('cheerio');

// let start = new Date();

// const getFirstNo = async (url) => {
//   try{
//   const res = await axios.get(url);
//   const html = res.data;
//   let num = [];

//   let $ = cheerio.load(html);

//   try {
//     $('.boardlist table tbody tr').each((index, data) => {
//       const td = $(data).find('td');
//       td.each((i, element) => {
//         if(i == 0) {
//           if($(element).children().length == 1) {
            
//           } else {
//             num.push($(element).text().trim())
//           }
//         }
//       })
//     })
//     return Math.max.apply(null, num)
//   } catch (e) {
//     console.log("e");
//   }
// }
// catch (e) {
//   console.log("Aa");
// }}

// const sql = "SELECT distinct major_code FROM MAJOR ORDER BY major_code;"

// db.query(sql, async (err, results) => {
//     if (err) {
//         console.log("학과 코드 조회 실패")
//     }
//     else {
//       for (const element of results) {
//         let boardType_seq = element.major_code;

//         const url = "https://www.gachon.ac.kr/major/bbs.jsp?boardType_seq="+boardType_seq
//         try{
//           await getFirstNo(url).then(result => {
//             // console.log(boardType_seq, result);
//             const cur_recent_no = result
//             const sql2 = "SELECT recent_no FROM RECENT where major_code=?"
//             db.query(sql2, boardType_seq, (err, res) => {
//               const pre_recent_no = res[0].recent_no;

//               // console.log(cur_recent_no, pre_recent_no);
//               if(err){
//                 console.log(err);
//               }
//               else {
//                 if(cur_recent_no == pre_recent_no){
//                   console.log(pre_recent_no, "동일한 최신글");
//                 }
//               }
//             })
//           })
//         } catch (e) {
//           console.log("ERROR", boardType_seq);
//         }
//       }

//       // 시간 복잡도 계산 - 8~9초
//       let end = new Date();
//       console.log(end-start);

//     }
// })





const dotenv = require('dotenv').config();

const admin = require("firebase-admin");

const serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const registrationToken = process.env.token;
const payload = {
    notification: {
        title: "컴퓨터공학과 새 글 알림",
        body: "공학교육혁신센터 AI자율주행차 체험 온라인 캠프 참가자 모집"
    }
}

admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    console.log("Successfully sent with response: ", response); 
  })
  .catch(function(error) {
      console.log("Error sending message: ", error);
  })