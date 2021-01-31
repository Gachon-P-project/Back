const axios = require('axios');
const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');
const noticesModel = require('../models/noticesModel')

const getNoticeList = async (url, pageNum) =>  {
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
                if(pageNum == 0){
                    if(i == 0) {
                        if($(element).children().length == 1 ) {
                            num = 0; // [공지] 태그가 붙어있으면 0으로 저장
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
                } else {
                    if(i == 0) {
                        if($(element).children().length == 1 ) {
                            num = 0; // [공지] 태그가 붙어있으면 0으로 저장
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
                        if(num == 0){
                            // 첫 페이지 다음부터는 [공지] 태그의 글은 response하지 않는다.
                        } else {
                            page.push(dataObj)
                        }
                        
                    }
                }
                
            })
        })
        return page;
        
    } catch(e) {
        console.log(e, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
    }
}

const getNoticeSearchList = async (url, pageNum) =>  {
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
                    if($(element).children().length == 1 ) {
                        num = 0; // [공지] 태그가 붙어있으면 0으로 저장
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
                    if(num == 0){
                        // [공지] 태그의 글은 response하지 않는다.
                    } else {
                        page.push(dataObj)
                    }
                    
                }
                
            })
        })
        return page;
        
    } catch(e) {
        console.log(e);
    }
}

const getClickedPosting = async (url) => {
    const res = await axios.get(url);
    const html = res.data;
    let $ = cheerio.load(html);
    
    try {
        const data = sanitizeHtml($('.boardview > table ').html(), {
            allowedTags: false,
            allowedAttributes: false,
            parser: {
                decodeEntities: true
            }
        });
        return data;
    } catch (e) {
        console.log(e);
    }
}

const getNoticeApart = (major, pageNum, callback) => {
    noticesModel.getNotice(major, result => {
        let notice_url = ''
        switch(major) {
            case "소프트웨어학과":
            case "AI":
                notice_url = result[0].notice_url + "&page=" + (pageNum + 1)
                break;
            case "자유전공":
                notice_url = result[0].notice_url + "/?page=" + (pageNum + 1)
                break;
            case "글로벌경영학트랙":
                break;
            case "첨단의료기기학과":
            case "게임영상학과":
            case "디스플레이학과":
            case "미래자동차학과":
                break;
            
        }
        getNoticeApartList(major, notice_url, pageNum, (result) => {
            callback(result)
        })
    })
}

const getNoticeSearchListApart = (major, word, pageNum, callback) => {
    noticesModel.getNotice(major, result => {
        let notice_url = ''
        switch(major) {
            case "소프트웨어학과":
            case "AI":
                notice_url = result[0].notice_url + "&page=" + (pageNum + 1) + "&s1=title&s2=" + word
                break;
            case "자유전공":
                notice_url = result[0].notice_url + "/?page=" + (pageNum + 1) + "&keyfield=all&keyword=" + word
                break;
            case "글로벌경영학트랙":
                break;
            case "첨단의료기기학과":
            case "게임영상학과":
            case "디스플레이학과":
            case "미래자동차학과":
                break;
            
        }
        getNoticeApartList(major, notice_url, pageNum, (result) => {
            callback(result)
        })
    })
}


const getNoticeApartList = async (major, url, pageNum, callback) => {
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

    switch(major) {
        case "소프트웨어학과":
        case "AI":
            try {
                $('.cms-content table tbody tr').each((index, data) => {
                    const td = $(data).find('td');
                    td.each((i, element) => {
                        /*
                            0 : 번호 => [공지]면 length 1, 아니면 0
                            1 : 제목
                            2 : 작성자(학과)
                            3 : 작성일
                            4 : 조회수
                        */
                        if(i == 0) {
                            if($(element).children().length == 1 ) {
                                num = 0; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }
            
                        if(i == 1) {
                            title = $(element).text().trim()
                            board_no = $(element).children().attr("data-idx")
                            if($(element).children().children().attr("class") == "fa fa-save") {
                                file = 1
                            } else {
                                file = 0
                            }
                        }
        
                        if(i == 2) {
                            date = $(element).text().trim();
                            const dataObj = {
                                "num" : num,
                                "board_no" : board_no,
                                "title" : title,
                                "file" : file,
                                "date" : date
                            }
                            if(pageNum != 1 && num == 0){
                                // 첫 페이지 다음부터는 [공지] 태그의 글은 response하지 않는다.
                            } else {
                                page.push(dataObj)
                            }
                        }
                    })
                });

            } catch(e) {
                console.log("getNoticeApartList Error in Controller:", e)
            }
            break;
        case "자유전공":
            try {
                $('.notice_table tbody tr').each((index, data) => {
                    const td = $(data).find('td');
                    td.each((i, element) => {
                        /*
                            0 : 번호 => [공지]면 length 1, 아니면 0
                            1 : 제목
                            2 : 작성자(학과)
                            3 : 작성일
                            4 : 조회수
                        */
                        // if(pageNum == 1){
                        if(i == 0) {
                            if($(element).children().length == 1 ) {
                                num = 0; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }
                        // } else {
                        //     if(i == 0) {
                        //         if($(element).children().length == 1 ) {
                        //             num = 0; // [공지] 태그가 붙어있으면 0으로 저장
                        //         } else {
                        //             num = $(element).text().trim()
                        //         }
                        //     }
                        // }
            
                        if(i == 1) {
                            title = $(element).text().trim()
        
                            // board_url
                            const tag_a = $(element).children().attr("href")
                            const start_num = tag_a.indexOf('uid=')+4
                            const end_num = tag_a.indexOf('&page')
                            board_no = tag_a.substring(start_num, end_num)
                            if($(element).children().attr("class") == "file") {
                                file = 1
                            } else {
                                file = 0
                            }
                        }
        
                        if(i == 3) {
                            date = $(element).text().trim();
                        }
        
                        if(i == 4) {
                            view = $(element).text().trim();
                            const dataObj = {
                                "num" : num,
                                "board_no" : board_no,
                                "title" : title,
                                "file" : file,
                                "date" : date,
                                "view" : view
                            }
                            if(pageNum != 1 && num == 0){
                                // 첫 페이지 다음부터는 [공지] 태그의 글은 response하지 않는다.
                            } else {
                                page.push(dataObj)
                            }
                            
                        }
                    })
                });
            } catch(e) {
                console.log("getNoticeApartList Error in Controller:", e)
            }
            break;
        case "글로벌경영학트랙":
            try {

            } catch(e) {
                console.log("getNoticeApartList Error in Controller:", e)
            }
            break;
        case "첨단의료기기학과":
        case "게임영상학과":
        case "디스플레이학과":
        case "미래자동차학과":
            try {

            } catch(e) {
                console.log("getNoticeApartList Error in Controller:", e)
            }
            break;
    }
    callback(page)
}



const getNoticePostingApart = (major, board_no, callback) => {
    noticesModel.getNotice(major, async result => {
        switch(major) {
            case "소프트웨어학과":
            case "AI":
                try {
                    url = result[0].notice_url + "&idx=" + board_no;
                    let base_url = url.substring(0, url.indexOf("kr")+2)
                    const res = await axios.get(url);
                    const html = res.data;
                    let $ = cheerio.load(html);

                    $('.cms-content .list-memo').find('img').each((index, elem) => {
                        var original_url = url.substring(0, url.indexOf("?"));

                        if(original_url.slice(-1) == '/')
                            original_url = original_url.substring(0, original_url.length-1);

                        imgurl = $(elem).attr("src")
                        processed_url = original_url;

                        while(imgurl.substr(0, 2) == "..") {
                            var divider = processed_url.split("/");
                            var processed_url = processed_url.substring(0, processed_url.indexOf(divider[divider.length - 1]));
                            imgurl = imgurl.substring(3)
                            if (processed_url.slice(-3) == "kr/")
                                break;
                        }
                        $(elem).attr("src", processed_url+imgurl)
                    })
                    $('.cms-content .list-memo').find('.attach a').each((index, elem) => {
                        href = base_url+$(elem).attr("href")
                        $(elem).attr("href", href)
                    })

                    const data = sanitizeHtml($('.cms-content .list-memo').html(), {
                        allowedTags: false,
                        allowedAttributes: false,
                        parser: {
                            decodeEntities: true
                        }
                    });
                    callback(data)
                } catch (e) {
                    console.log(e)
                }
                break;
            case "자유전공":
                try {
                    url = result[0].notice_url + "_view?uid=" + board_no;
                    let base_url = url.substring(0, url.indexOf("kr")+2)
                    const res = await axios.get(url);
                    const html = res.data;
                    let $ = cheerio.load(html);

                    $('.freebox tbody').find('img').each((index, elem) => {
                        var original_url = url.substring(0, url.indexOf("?"));

                        if(original_url.slice(-1) == '/')
                            original_url = original_url.substring(0, original_url.length-1);

                        imgurl = $(elem).attr("src")
                        processed_url = original_url;

                        while(imgurl.substr(0, 2) == "..") {
                            var divider = processed_url.split("/");
                            var processed_url = processed_url.substring(0, processed_url.indexOf(divider[divider.length - 1]));
                            imgurl = imgurl.substring(3)
                            if (processed_url.slice(-3) == "kr/")
                                break;
                        }
                        $(elem).attr("src", processed_url+imgurl)
                    })
                    $('.cms-content .list-memo').find('.attach a').each((index, elem) => {
                        href = base_url+$(elem).attr("href")
                        $(elem).attr("href", href)
                    })

                    const data = sanitizeHtml($('.cms-content .list-memo').html(), {
                        allowedTags: false,
                        allowedAttributes: false,
                        parser: {
                            decodeEntities: true
                        }
                    });
                    callback(data)
                } catch (e) {
                    console.log(e)
                }
                break;
            case "글로벌경영학트랙":
                break;
            case "첨단의료기기학과":
            case "게임영상학과":
            case "디스플레이학과":
            case "미래자동차학과":
                break;
            
        }
    })




}





module.exports.getNoticeList = getNoticeList;
module.exports.getNoticeSearchList = getNoticeSearchList;
module.exports.getClickedPosting = getClickedPosting;
module.exports.getNoticeApart = getNoticeApart;
module.exports.getNoticePostingApart = getNoticePostingApart;
module.exports.getNoticeSearchListApart = getNoticeSearchListApart;