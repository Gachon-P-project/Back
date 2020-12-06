const axios = require('axios');
const cheerio = require('cheerio');

const url = "https://www.gachon.ac.kr/major/bbs.jsp?pageNum=0&pageSize=10&boardType_seq=159&approve=&secret=&answer=&branch=&searchopt=&searchword="

const crawler = async() => {
    const res = await axios.get(url);
    const html = res.data;
    
    let $ = cheerio.load(html);

    try {
        $('.boardlist table tbody tr').each((index, data) => {
            if (index >= 3){
                const td = $(data).find('td')
                td.each((index, data)=>{
                    /*
                        0 : 번호
                        1 : 제목
                        2 : 작성자(학과)
                        3 : 첨부파일 이미지
                        4 : 작성일
                        5 : 조회수
                    */
                    if(index == 1){
                        console.log($(data).text().trim());
                    }
                })
            }
            
        })
    } catch(e) {
        console.log(e);
    }
}
crawler();

