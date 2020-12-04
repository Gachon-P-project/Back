const axios = require('axios');
const cheerio = require('cheerio');

const url = "https://www.gachon.ac.kr/major/bbs.jsp?boardType_seq=159"

const crawler = async() => {
    const res = await axios.get(url);
    const html = res.data;
    
    let $ = cheerio.load(html);

    // 페이지 데이터 저장 객체 생성
    let num = '';
    let title = '';
    let file = '';
    let date = '';
    let view = '';
    const page = new Array();

    try {
        $('.boardlist table tbody tr').each((index, data) => {
            const td = $(data).find('td');
            td.each((i, element)=>{
                /*
                    0 : 번호 => [공지]면 length 1, 아니면 0
                    1 : 제목
                    2 : 작성자(학과)
                    3 : 첨부파일 이미지 => 없으면 length 0, 있으면 1
                    4 : 작성일
                    5 : 조회수
                */
                if(i == 0) {
                    if($(element).children().length == 1) {
                        num = 9999;
                    } else {
                        num = $(element).text().trim()
                    }
                }

                if(i == 1) {
                    title = $(element).text().trim()
                }

                if(i == 3) {
                    if($(element).children().length == 1) {
                        file = 1;
                    } else {
                        file = 0;
                    }
                }

                if(i == 4) {
                    date = $(element).text().trim();
                }

                if(i == 5) {
                    view = $(element).text().trim();
                    const dataObj = {
                        "num" : num,
                        "title" : title,
                        "file" : file,
                        "date" : date,
                        "view" : view
                    }
                    page.push(dataObj)
                }

                // console.log($(element).text().trim());
                // console.log($(element).children().length);
            })
        })

        console.log(page);
    } catch(e) {
        console.log(e);
    }
}
crawler();

