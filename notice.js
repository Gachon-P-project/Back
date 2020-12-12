const axios = require('axios');
const cheerio = require('cheerio');

const pageNum = 0; // 몇번째 페이지
const pageSize = 10; // 한 페이지에 몇개씩 받을 것인지([공지] 태그 글은 제외)
const boardType_seq = 159;
const url = "https://www.gachon.ac.kr/major/bbs.jsp?pageNum="+pageNum+"&pageSize="+pageSize+"&boardType_seq="+boardType_seq+"&approve=&secret=&answer=&branch=&searchopt=&searchword="

const crawler = async() => {
    const res = await axios.get(url);
    const html = res.data;
    
    let $ = cheerio.load(html);

    // 페이지 데이터 저장 객체 생성
    let num = '';
    let board_no = '';
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
                        num = 0000; // [공지] 태그가 붙어있으면 0000으로 저장
                    } else {
                        num = $(element).text().trim()
                    }
                }

                if(i == 1) {
                    title = $(element).text().trim()

                    // 실제 board_no 추출
                    const tag_a = $(element).children().attr("href")
                    const start_num = tag_a.indexOf('board_no')+9
                    const end_num = tag_a.indexOf('approve')-1
                    board_no = tag_a.substring(start_num, end_num)
                    //console.log(tag_a.substring(start_num, end_num));
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
                        "board_no" : board_no,
                        "title" : title,
                        "file" : file,
                        "date" : date,
                        "view" : view
                    }
                    page.push(dataObj)
                }
            })
        })

        console.log(page);
    } catch(e) {
        console.log(e);
    }
}
crawler();

