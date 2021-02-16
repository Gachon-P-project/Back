const axios = require('axios');
const cheerio = require('cheerio');
const e = require('express');
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
                    if(pageNum != 0 && num == 0){
                        // 첫 페이지 다음부터는 [공지] 태그의 글은 response하지 않는다.
                    } else {
                        page.push(dataObj)
                    }
                    
                }
                // }
                
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
    let base_url = url.substring(0, url.indexOf("kr")+2)
    
    try {
        
        // 이미지 
        $('.boardview > table tbody').find('img').each((index, elem) => {
            imgurl = $(elem).attr("src")
            
            if (imgurl != null && (imgurl.substr(0, 7) == "/board/" || imgurl.substr(0, 8) == "/images/" || imgurl.substr(0, 7) == "/Files/")) {
                href = imgurl + $(elem).attr("href")
                href.replace("&amp;", "&")
                $(elem).attr("src", base_url+imgurl)
            }

        })
        // 첨부파일
        $('.boardview > table tbody').find('a').each((index, elem) => {
            var file_url = $(elem).attr("href")
            if (file_url != null && file_url.substr(0, 7) == "/board/") {
                href = base_url + $(elem).attr("href")
                href.replace("&amp;", "&")
                $(elem).attr("href", href)
            }
        })

        var result = [];
        $('.boardview > table tbody tr').each((index, elem) => {
            if(index == 4 || index == 5){
                result.push($(elem))
            }
        });
        result = "<table>" + result.join("\n") + "</table>"



        const data = sanitizeHtml($(result).html(), {
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
            case "가천대학교":
                notice_url = result[0].notice_url + "&pageNum=" + pageNum
            case "소프트웨어":
            case "AI":
                notice_url = result[0].notice_url + "&page=" + String(Number(pageNum) + 1)
                break;
            case "자유전공":
                notice_url = result[0].notice_url + "/?page=" + String(Number(pageNum) + 1)
                break;
            case "글로벌경영학트랙":
                notice_url = result[0].notice_url + "?&page=" + String(Number(pageNum) + 1)
                break;
            case "첨단의료기기":
            case "게임":
            case "게임·영상학과":
            case "디스플레이":
            case "미래자동차":
                notice_url = result[0].notice_url + "?pageNum=" + pageNum
                break;
            case "의학과(M)":
            case "의예과(M)":
                notice_url = result[0].notice_url + "?code=student&page=" + String(Number(pageNum) + 1)
                break;
            case "약학과(M)": 
                notice_url = result[0].notice_url + "?board_code=sub4_1&page=" + String(Number(pageNum) + 1)
                break;
            case "의용생체공학과(M)":
                notice_url = result[0].notice_url + "&page=" + String(Number(pageNum) + 1)
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
            case "가천대학교":
                notice_url = result[0].notice_url + "&pageNum=" + pageNum + "&searchopt=title&searchword=" + word;
                break;
            case "소프트웨어":
            case "AI":
                notice_url = result[0].notice_url + "&page=" + String(Number(pageNum) + 1) + "&s1=title&s2=" + word;
                break;
            case "자유전공":
                notice_url = result[0].notice_url + "/?page=" + String(Number(pageNum) + 1) + "&keyfield=all&keyword=" + word;
                break;
            case "글로벌경영학트랙":
                notice_url = result[0].notice_url + "?&page=" + String(Number(pageNum) + 1) + "&keyfield=all&keyword=" + word;
                break;
            case "첨단의료기기":
            case "게임":
            case "게임·영상학과":
            case "디스플레이":
            case "미래자동차":
                // 홈페이지 자체 검색 기능 X
                notice_url = result[0].notice_url + "?pageNum=" + pageNum;
                break;
            case "의학과(M)":
            case "의예과(M)":
                notice_url = result[0].notice_url + "?code=student&page=" + String(Number(pageNum) + 1) + "&keyfield=all&key=" + word;
                break;
            case "약학과(M)": 
                notice_url = result[0].notice_url + "&page=" + String(Number(pageNum) + 1) + "&search_key=" + word;
                break;
            case "의용생체공학과(M)":
                notice_url = result[0].notice_url + "&page=" + String(Number(pageNum) + 1) + "stx=" + word;
                break;
        }
        getNoticeApartList(major, notice_url, pageNum, (result) => {
            callback(result)
        })
    })
}
const getNoticeUrlApart = (major, board_no, callback) => {
    noticesModel.getNotice(major, result => {
        let notice_url = ''
        switch(major) {
            case "가천대학교":
                notice_url = result[0].notice_url + "&mode=view&board_no=" + board_no;
                break;
            case "소프트웨어":
            case "AI":
                notice_url = result[0].notice_url + "&idx=" + board_no;
                break;
            case "자유전공":
                notice_url = result[0].notice_url + "_view?uid=" + board_no;
                break;
            case "글로벌경영학트랙":
                notice_url = result[0].notice_url.slice(0, -5) + "_view?uid=" + board_no;
                break;
            case "첨단의료기기":
            case "게임":
            case "게임·영상학과":
            case "디스플레이":
            case "미래자동차":
                // 홈페이지 자체 검색 기능 X
                notice_url = result[0].notice_url + "?mode=view&board_no=" + board_no;
                break;
            case "의학과(M)":
            case "의예과(M)":
                notice_url = result[0].notice_url.split("-")[0] + "-view.php?code=student&body=view&number=" + board_no;
                break;
            case "약학과(M)": 
                notice_url = result[0].notice_url.slice(0, -8) + "read.htm?list_mode=board&board_code=sub4_1&idx=" + board_no;
                break;
            case "의용생체공학과(M)":
                notice_url = result[0].notice_url + "&wr_id=" + board_no;
                break;
        }
        callback(notice_url)
    })
}


const getNoticeApartList = async (major, url, pageNum, callback) => {
    const res = await axios.get(url);
    const html = res.data;
    console.log(url)
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
        case "가천대학교":
            try {
                $('.boardlist table tbody tr').each((index, data) => {
                    const td = $(data).find('td');
                    td.each((i, element)=>{
                        /*
                            0 : 번호 => [공지]면 length 1, 아니면 0
                            1 : 제목
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
                        }

                        if(i == 2) {
                            if($(element).children().length == 1) {
                                file = 1;
                            } else {
                                file = 0;
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
                            if(pageNum != 0 && num == 0){
                                // 첫 페이지 다음부터는 [공지] 태그의 글은 response하지 않는다.
                            } else {
                                page.push(dataObj)
                            }
                            
                        }
                        // }
                        
                    })
                })
            } catch(e) {
                console.log("getNoticeApartList Error in Controller:", e)
            }
            break;
        case "소프트웨어":
        case "AI":
            try {
                $('.cms-content table tbody tr').each((index, data) => {
                    const td = $(data).find('td');
                    td.each((i, element) => {
                        /*
                            0 : 번호 => [공지]면 length 1, 아니면 0
                            1 : 제목
                            2 : 작성일
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
                                "date" : date,
                                "view" : "-1"
                            }
                            if(pageNum != 0 && num == 0){
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
                        if(i == 0) {
                            if($(element).children().length == 1 ) {
                                num = 0; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }

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
                            if(pageNum != 0 && num == 0){
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
                $('#container .sub_cont .sub_box .gall_cont table tbody tr').each((index, data) => {
                    const td = $(data).find('td');
                    td.each((i, element) => {
                        // console.log($(element).text())
                        /*
                            0 : 번호 => [공지]면 length 1, 아니면 0
                            1 : 제목
                            2 : 작성일
                            3 : 조회수
                        */
                        if(i == 0) {
                            if($(element).text().trim() == "공지" ) {
                                num = 0; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }
            
                        if(i == 1) {
                            title = $(element).text().trim()
                            // board_url
                            const tag_a = $(element).children().attr("href")
                            const start_num = tag_a.indexOf('uid=')+4
                            const end_num = tag_a.indexOf('&page')
                            board_no = tag_a.substring(start_num, end_num)
                            file = 0
                        }
        
                        if(i == 2) {
                            date = $(element).text().trim();
                        }

                        if(i == 3) {
                            view = $(element).text().trim();
                            const dataObj = {
                                "num" : num,
                                "board_no" : board_no,
                                "title" : title,
                                "file" : file,
                                "date" : date,
                                "view" : view
                            }
                            if(pageNum != 0 && num == 0){
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
        case "첨단의료기기":
        case "게임":
        case "게임·영상학과":
        case "디스플레이":
        case "미래자동차":
            try {
                $('.container .boardlist tbody tr').each((index, data) => {
                    const td = $(data).find('td');
                    td.each((i, element) => {
                        /*
                            0 : 번호 => [공지]면 length 1, 아니면 0
                            1 : 제목
                            3 : 파일
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
                            // board_url
                            const tag_a = $(element).children().attr("href")
                            const start_num = tag_a.indexOf('board_no=')+8
                            const end_num = tag_a.indexOf('&approve')
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
                            if(pageNum != 0 && num == 0){
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
        case "의학과(M)":
        case "의예과(M)":
            try {
                $('.notice table tbody tr').each((index, data) => {
                    const td = $(data).find('td');
                    td.each((i, element) => {
                        /*
                            0 : 번호 => [공지]면 length 1, 아니면 0
                            1 : 제목
                            3 : 작성일
                            4 : 조회수
                            5 : 파일
                        */
                        if(i == 0) {
                            if($(element).attr("class") == "notify" ) {
                                num = 0; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }

                        if(i == 1) {
                            title = $(element).text().trim()
                            // board_url
                            const tag_a = $(element).children().attr("href")
                            const start_num = tag_a.indexOf('number=')+7
                            const end_num = tag_a.indexOf('&keyfield')
                            board_no = tag_a.substring(start_num, end_num)
                        }
        
                        if(i == 3) {
                            date = $(element).text().trim();
                        }
                        if(i == 4) {
                            view = $(element).text().trim();
                        }
        
                        if(i == 5) {
                            if($(element).children().length == 1) {
                                file = 1;
                            } else {
                                file = 0;
                            }
                            const dataObj = {
                                "num" : num,
                                "board_no" : board_no,
                                "title" : title,
                                "file" : file,
                                "date" : date,
                                "view" : view
                            }
                            if(pageNum != 0 && num == 0){
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
        case "약학과(M)": 
            try {
                $('body table table table .BoardTable ').each((index, data) => {
                    if(index == 3){
                        const tr = $(data).find('tr')
                    
                        console.log(index, $(tr).text().trim())
                        if(tr.children().length >= 4){
                            $(tr).each((index, td) => {
                                td.each((i, element) => {
                                    // console.log($(element).text())
                                    /*
                                        0 : 번호 => [공지]면 length 1, 아니면 0
                                        1 : 제목
                                        3 : 조회수
                                        4 : 작성일
                                    */
                                    if(i == 0) {
                                        if($(element).attr("colspan") == "1" ) {
                                            num = 0; // [공지] 태그가 붙어있으면 0으로 저장
                                        } else {
                                            num = $(element).text().trim()
                                        }
                                    }

                                    if(i == 1) {
                                        title = $(element).text().trim()
                                        // board_url
                                        const tag_a = $(element).children().attr("href")
                                        // console.log($(tag_a).text())
                                        const start_num = tag_a.indexOf('board_no=')+8
                                        const end_num = tag_a.indexOf('&approve')
                                        board_no = tag_a.split("\'")[1]
                                        if (img.slice('.')[0] == "ico_file") {
                                            file = 1;
                                        } else{
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
                                        if(pageNum != 0 && num == 0){
                                            // 첫 페이지 다음부터는 [공지] 태그의 글은 response하지 않는다.
                                        } else {
                                            page.push(dataObj)
                                        }
                                    }
                                })
                            });
                        }
                    }
                });
            } catch(e) {
                console.log("getNoticeApartList Error in Controller:", e)
            }
            break;
        case "의용생체공학과(M)":
            try {
                $('.tbl_head01 table tbody tr').each((index, data) => {
                    const td = $(data).find('td');
                    td.each((i, element) => {
                        /*
                            0 : 번호 => [공지]면 length 1, 아니면 0
                            2 : 제목
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
                            title = $(element).children().children("a").text().trim()
                            // board_url
                            const tag_a = $(element).children().children("a").attr("href")
                            const start_num = tag_a.indexOf('wr_id=')+6
                            const end_num = tag_a.indexOf('&page')
                            board_no = tag_a.substring(start_num, end_num)
                            file = 0
                            $(element).children().find('i').each((index, elem) => {
                                if($(elem).attr("class") == "fa fa-download"){
                                    file = 1
                                }
                            })
                        }

                        if(i == 3) {
                            view = $(element).text().trim();
                        }
                        if(i == 4) {
                            date = $(element).text().trim();
                            const dataObj = {
                                "num" : num,
                                "board_no" : board_no,
                                "title" : title,
                                "file" : file,
                                "date" : date,
                                "view" : view
                            }
                            if(pageNum != 0 && num == 0){
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
    }
    callback(page)
}

const getNoticePostingApart = (major, board_no, callback) => {
    noticesModel.getNotice(major, async result => {
        switch(major) {
            case "가천대학교":
                try {
                    url = result[0].notice_url + "&mode=view&board_no=" + board_no;
                    data = await getClickedPosting(url)
                    callback(data)
                } catch(e) {
                    console.log("getNoticePostingApart Error in Controller:", e)
                }
                break;
            case "소프트웨어":
            case "AI":
                try {
                    url = result[0].notice_url + "&idx=" + board_no;
                    let base_url = url.substring(0, url.indexOf("kr")+2)
                    const res = await axios.get(url);
                    const html = res.data;
                    let $ = cheerio.load(html);

                    // 이미지 
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
                    // 첨부파일 
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

                    // 이미지 
                    $('.free_box .free_topTable tbody tr').find('img').each((index, elem) => {
                        var original_url = url.substring(0, url.indexOf("?"));

                        if(original_url.slice(-1) == '/')
                            original_url = original_url.substring(0, original_url.length-1);

                        imgurl = $(elem).attr("src")
                        processed_url = original_url;

                        while(imgurl.substr(0, 2) == "..") {
                            divider = processed_url.split("/");
                            var processed_url = processed_url.substring(0, processed_url.indexOf(divider[divider.length - 1]) - 1);
                            console.log(processed_url)
                            imgurl = imgurl.substring(3)
                            if (processed_url.slice(-4) == ".kr/")
                                break;
                        }
                        console.log(processed_url+imgurl)
                        $(elem).attr("src", processed_url+imgurl)
                    })
                    // 첨부파일
                    $('.free_box .free_topTable tbody tr .free_file').find('a').each((index, elem) => {
                        // divider = $(elem).attr("href").indexOf('?')
                        if($(elem).attr('href').substring(0, 4) != "http"){
                            href = base_url + '/notice/' + $(elem).attr("href")
                            href.replace("&amp;", "&")
                            $(elem).attr("href", href)
                        }
                    })

                    // 등록일, 조회수 제외
                    var tmp = [];
                    $('.free_box .free_topTable tbody tr').each((index, elem) => {
                        if(index != 0 ){
                            tmp.push($(elem))
                        }
                    });
                    tmp = "<table>" + tmp.join("\n") + "</table>"
                    const data = sanitizeHtml($(tmp).html(), {
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
                try {
                    url = result[0].notice_url.slice(0, -5) + "_view?uid=" + board_no;
                    console.log(url)
                    let base_url = url.substring(0, url.indexOf("kr")+2)
                    const res = await axios.get(url);
                    const html = res.data;
                    let $ = cheerio.load(html);

                    // 이미지 
                    $('#container .sub_cont .sub_box table tbody').find('img').each((index, elem) => {
                        // console.log(elem.html())
                        var original_url = url.substring(0, url.indexOf("?"));

                        if(original_url.slice(-1) == '/')
                            original_url = original_url.substring(0, original_url.length-1);

                        imgurl = $(elem).attr("src")
                        processed_url = original_url;

                        console.log(imgurl)
                        if(imgurl.substr(0, 4) != "http" && imgurl.substr(0, 4) != "data"){
                            while(imgurl.substr(0, 2) == "..") {
                                divider = processed_url.split("/");
                                var processed_url = processed_url.substring(0, processed_url.indexOf(divider[divider.length - 1]) - 1);
                                imgurl = imgurl.substring(3)
                                if (processed_url.slice(-4) == ".kr/")
                                    break;
                            }
                            console.log(processed_url+imgurl)
                            $(elem).attr("src", processed_url+imgurl)
                        }
                    })
                    // 첨부파일
                    $('#container .sub_cont .sub_box table tbody').find('a').each((index, elem) => {
                        divider = $(elem).attr("href").indexOf('?')
                        if($(elem).attr('href').substring(0, divider) == "filedown"){
                            href = base_url + '/global/community/' + $(elem).attr("href")
                            href.replace("&amp;", "&")
                            $(elem).attr("href", href)
                        }
                    })

                    // 등록일, 조회수 제외
                    var tmp = [];
                    $('#container .sub_cont .sub_box table tbody tr').each((index, elem) => {
                        if(index >= 2 && index < $('#container .sub_cont .sub_box table tbody tr').length -2 ){
                            tmp.push($(elem))
                        }
                    });
                    tmp = "<table>" + tmp.join("\n") + "</table>"
                    const data = sanitizeHtml($(tmp).html(), {
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
            case "첨단의료기기":
            case "게임":
            case "게임·영상학과":
            case "디스플레이":
            case "미래자동차":
                try {
                    url = result[0].notice_url + "?mode=view&board_no=" + board_no;
                    let base_url = url.substring(0, url.indexOf("kr")+2)
                    const res = await axios.get(url);
                    const html = res.data;
                    let $ = cheerio.load(html);

                    // 이미지 
                    $('.container .boardview table tbody').find('img').each((index, elem) => {
                        imgurl = $(elem).attr("src")

                        $(elem).attr("src", base_url+imgurl)

                    })
                    // 첨부파일
                    $('.container .boardview table tbody').find('a').each((index, elem) => {
                        var file_url = $(elem).attr("href")
                        if (file_url != null && file_url.substr(0, 7) == "/board/") {
                            href = base_url + $(elem).attr("href")
                            href.replace("&amp;", "&")
                            $(elem).attr("href", href)
                        }
                    })

                    // 제목, 작성자, 등록일, 조회수 제외
                    var tmp = [];
                    $('.container .boardview table tbody tr').each((index, elem) => {
                        if(index >= 3) {
                            tmp.push($(elem))
                        }
                    });
                    tmp = "<table>" + tmp.join("\n") + "</table>"
                    const data = sanitizeHtml($(tmp).html(), {
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
            case "의학과(M)":
            case "의예과(M)":
                try {
                    url = result[0].notice_url.split("-")[0] + "-view.php?code=student&body=view&number=" + board_no;
                    let base_url = url.substring(0, url.indexOf("kr")+2)
                    const res = await axios.get(url);
                    const html = res.data;
                    let $ = cheerio.load(html);

                    // 이미지 
                    $('#contents table tbody').find('img').each((index, elem) => {
                        imgurl = $(elem).attr("src")
                        if(imgurl.substr(0, 1) == '/') {
                            $(elem).attr("src", base_url+imgurl)
                        }
                    })
                    // 첨부파일
                    $('#contents table tbody').find('a').each((index, elem) => {
                        var file_url = $(elem).attr("href")
                        if (file_url != null && file_url.substr(0, 1) == "/") {
                            href = base_url + $(elem).attr("href")
                            href.replace("&amp;", "&")
                            $(elem).attr("href", href)
                        }
                    })

                    const data = sanitizeHtml($('#contents table tbody').html(), {
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
            case "약학과(M)": 
                try {
                    url = result[0].notice_url.slice(0, -8) + "read.htm?list_mode=board&board_code=sub4_1&idx=" + board_no;
                    let base_url = url.substring(0, url.indexOf("shop/")+5)
                    const res = await axios.get(url);
                    const html = res.data;
                    let $ = cheerio.load(html);
                    
                    // 첨부파일
                    $('.ViewTable > tbody > tr > td > table').find('a').each((index, elem) => {
                        var file_url = $(elem).attr("href")
                        if (file_url != null && file_url.substring(0, 24) == "javascript:file_download") {
                            href = base_url + "file_download.php?board_code=sub4_1&board_idx=" + board_no +"&sel_no=" + file_url.substr(file_url.indexOf("(")+1, 1)
                            href.replace("&amp;", "&")
                            $(elem).attr("href", href)
                        }
                    })

                    var tmp = [];
                    $('.ViewTable > tbody > tr > td > table').each((index, elem) => {
                        if(index == 0){
                            $(elem).children().children('tr').each((index, elem) => {
                                if(index >= 3 && index <= 4)
                                    tmp.push($(elem))
                            })
                        }
                    });
                    tmp = "<table>" + tmp.join("\n") + "</table>"
                    const data = sanitizeHtml($(tmp).html(), {
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
            case "의용생체공학과(M)":
                try {
                    url = result[0].notice_url + "&wr_id=" + board_no;
                    const res = await axios.get(url);
                    const html = res.data;
                    let $ = cheerio.load(html);

                    // 제목 제외
                    var tmp = [];
                    $('#bo_v').children('section').each((index, elem) => {
                        tmp.push($(elem))
                    });
                    tmp = "<article>" + tmp.join("\n") + "</article>"
                    const data = sanitizeHtml($(tmp).html(), {
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
module.exports.getNoticeUrlApart = getNoticeUrlApart;