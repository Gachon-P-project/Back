import { Request, Response } from 'express';
import { NoticeApart } from '../entities/NoticeApart';
import { Major } from '../entities/Major';
import { getRepository, getConnection } from 'typeorm';
import { isAccessor } from 'typescript';
import cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';





// 공지사항 리스트 조회
export const getNoticeList = async (req:Request, res:Response) => {
    let pageNum = Number(req.params.page_num);
    let major = req.params.major;

    const major_apart = ["가천대학교", "소프트웨어", "자유전공", "글로벌경영학트랙", "AI", "첨단의료기기학과", "게임·영상학과", "게임", "디스플레이", "미래자동차", "의학과(M)", "의예과(M)", "약학과(M)", "의용생체공학과(M)"]
    let noticeListUrl = null
    let isAparted = false

    for (var ma in major_apart) {
        if(major.includes(major_apart[ma])) {
            isAparted = true
            let modified_major = <string>getMajorNameApart(major);
            noticeListUrl = String(await getApartedNoticeBaseUrl(modified_major))

            getNoticeListApart(major, noticeListUrl, pageNum).then(result => {
                if (result) {
                    console.log("GET NOTICE LIST", major, "-", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                    res.status(200).json(result);
                } else {
                    res.status(404).json({error: 'Notice: 데이터가 없습니다.'});
                }
            })
        }
    }
    if (!isAparted){
        
        let major_code = await getMajorCode(major);
        noticeListUrl = process.env.notice_link+"pageNum="+pageNum+"&pageSize=10&boardType_seq="+String(major_code)+"&approve=&secret=&answer=&branch=&searchopt=&searchword=";
        console.log(noticeListUrl)
        getNoticeListCommon(noticeListUrl, pageNum).then(result => {
            // console.log(result)
            if (result) {
                console.log("GET NOTICE LIST:", major, "-", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                res.status(200).json(result);
            } else {
                res.status(404).json({error: 'Notice: 데이터가 없습니다.'});
            }
        });
        

    }
};


// 공통 홈페이지 학과 공지 리스트 조회
const getNoticeListCommon = async(url: string, pageNum: number) => {
    const res = await axios.get(url);
    const html = res.data;
    let $ = cheerio.load(html);

    // 페이지 데이터 저장 객체 생성
    let num: string;
    let board_no: string;
    let title: string;
    let file: number;
    let date: string;
    let view: string;
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
                        num = "0"; // [공지] 태그가 붙어있으면 0으로 저장
                    } else {
                        num = $(element).text().trim()
                    }
                }

                if(i == 1) {
                    title = $(element).text().trim()

                    // 실제 board_no 추출
                    const tag_a = <string>$(element).children().attr("href")
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
                    if(pageNum != 0 && num == "0"){
                        // 첫 페이지 다음부터는 [공지] 태그의 글은 response하지 않는다.
                    } else {
                        page.push(dataObj)
                    }
                    
                }
                // }
                
            })
        })
        return new Promise( (resolve, reject) => {
            if (page.length == 0) reject(new Error("no data"))
            else resolve(page)
        })
        
    } catch(e) {
        console.log(e, new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
    }
}; 

// 별도 홈페이지 학과 공지 리스트 조최
const getNoticeListApart = async (major: string, url: string, pageNum: number) => {
    const res = await axios.get(url);
    const html = res.data;
    console.log(url)
    let $ = cheerio.load(html);

    // 페이지 데이터 저장 객체 생성
    let num: string;
    let board_no: string;
    let title: string;
    let file: number;
    let date: string;
    let view: string;
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
                                num = "0"; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }

                        if(i == 1) {
                            title = $(element).text().trim()

                            // 실제 board_no 추출
                            const tag_a = <string>$(element).children().attr("href")
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
                            if(pageNum != 0 && num == "0"){
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
                                num = "0"; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }
            
                        if(i == 1) {
                            title = $(element).text().trim()
                            board_no = <string>$(element).children().attr("data-idx")
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
                            if(pageNum != 0 && num == "0"){
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
                                num = "0"; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }

                        if(i == 1) {
                            title = $(element).text().trim()
                            // board_url
                            const tag_a = <string>$(element).children().attr("href")
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
                            if(pageNum != 0 && num == "0"){
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
                                num = "0"; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }
            
                        if(i == 1) {
                            title = $(element).text().trim()
                            // board_url
                            const tag_a = <string>$(element).children().attr("href")
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
                            if(pageNum != 0 && num == "0"){
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
                                num = "0"; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }

                        if(i == 1) {
                            title = $(element).text().trim()
                            // board_url
                            const tag_a = <string>$(element).children().attr("href")
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
                            if(pageNum != 0 && num == "0"){
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
                                num = "0"; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }

                        if(i == 1) {
                            title = $(element).text().trim()
                            // board_url
                            const tag_a = <string>$(element).children().attr("href")
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
                            if(pageNum != 0 && num == "0"){
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
                        // if(tr.children().length >= 4){
                        //     $(tr).each((index, td) => {
                        //         $(td).each((i, element) => {
                        //             // console.log($(element).text())
                        //             /*
                        //                 0 : 번호 => [공지]면 length 1, 아니면 0
                        //                 1 : 제목
                        //                 3 : 조회수
                        //                 4 : 작성일
                        //             */
                        //             if(i == 0) {
                        //                 if($(element).attr("colspan") == "1" ) {
                        //                     num = "0"; // [공지] 태그가 붙어있으면 0으로 저장
                        //                 } else {
                        //                     num = $(element).text().trim()
                        //                 }
                        //             }

                        //             if(i == 1) {
                        //                 title = $(element).text().trim()
                        //                 // board_url
                        //                 const tag_a = <string>$(element).children().attr("href")
                        //                 const start_num = tag_a.indexOf('board_no=')+8
                        //                 const end_num = tag_a.indexOf('&approve')
                        //                 board_no = tag_a.split("\'")[1]
                        //                 if (img.slice('.')[0] == "ico_file") {
                        //                     file = 1;
                        //                 } else{
                        //                     file = 0
                        //                 }
                        //             }

                        //             if(i == 3) {
                        //                 date = $(element).text().trim();
                        //             }
                        //             if(i == 4) {
                        //                 view = $(element).text().trim();
                        //                 const dataObj = {
                        //                     "num" : num,
                        //                     "board_no" : board_no,
                        //                     "title" : title,
                        //                     "file" : file,
                        //                     "date" : date,
                        //                     "view" : view
                        //                 }
                        //                 if(pageNum != 0 && num == "0"){
                        //                     // 첫 페이지 다음부터는 [공지] 태그의 글은 response하지 않는다.
                        //                 } else {
                        //                     page.push(dataObj)
                        //                 }
                        //             }
                        //         })
                        //     });
                        // }
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
                                num = "0"; // [공지] 태그가 붙어있으면 0으로 저장
                            } else {
                                num = $(element).text().trim()
                            }
                        }

                        if(i == 1) {
                            title = $(element).children().children("a").text().trim()
                            // board_url
                            const tag_a = <string>$(element).children().children("a").attr("href")
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
                            if(pageNum != 0 && num == "0"){
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
    // callback(page)
    // return page
    return new Promise( (resolve, reject) => {
        if (page.length == 0) reject(new Error("no data"))
        else resolve(page)
    })
}

/* =============================== 공지 리스트 끝 =============================== */ 



// 공지사항 검색
export const getNoticeSearchedList = async (req:Request, res:Response) => {
    const pageNum = Number(req.params.page_num);
    const major = req.params.major;
    const search = req.params.search;
    
    const major_apart = ["가천대학교", "소프트웨어", "자유전공", "글로벌경영학트랙", "AI", "첨단의료기기학과", "게임·영상학과", "게임", "디스플레이", "미래자동차", "의학과(M)", "의예과(M)", "약학과(M)", "의용생체공학과(M)"]
    let noticeListUrl = null
    let isAparted = false

    for (var ma in major_apart) {
        if(major.includes(major_apart[ma])) {
            isAparted = true
            let modified_major = <string>getMajorNameApart(major);
            noticeListUrl = String(await getApartedNoticeBaseUrl(modified_major))

            getNoticeSearchListApart(major, search, pageNum, noticeListUrl, res)
        }
    }
    if (!isAparted){

        let major_code = await getMajorCode(major);
        noticeListUrl = process.env.notice_link+"pageNum="+pageNum+"&pageSize=10&boardType_seq="+String(major_code)+"&approve=&secret=&answer=&branch=&searchopt=title&searchword="+encodeURI(search);
        console.log(noticeListUrl)
        getNoticeListCommon(noticeListUrl, pageNum).then(result => {
            if (result) {
                console.log("GET NOTICE SEARCHED LIST:", major, "-", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                res.status(200).json(result);
            } else {
                res.status(404).json({error: 'Notice: 데이터가 없습니다.'});
            }
        });
        

    }
};

// 별도 홈페이지 학과 공지 리스트 조최 
const getNoticeSearchListApart = async (major: string, word: string, pageNum: number, url: string, res: Response) => {
    let noticeListUrl = null;
    
    switch(major) {
        case "가천대학교":
            noticeListUrl = String(url) + "&pageNum=" + pageNum + "&searchopt=title&searchword=" + word;
            break;
        case "소프트웨어":
        case "AI":
            noticeListUrl = String(url) + "&page=" + String(Number(pageNum) + 1) + "&s1=title&s2=" + word;
            break;
        case "자유전공":
            noticeListUrl = String(url) + "/?page=" + String(Number(pageNum) + 1) + "&keyfield=all&keyword=" + word;
            break;
        case "글로벌경영학트랙":
            noticeListUrl = String(url) + "?&page=" + String(Number(pageNum) + 1) + "&keyfield=all&keyword=" + word;
            break;
        case "첨단의료기기":
        case "게임":
        case "게임·영상학과":
        case "디스플레이":
        case "미래자동차":
            // 홈페이지 자체 검색 기능 X
            noticeListUrl = String(url) + "?pageNum=" + pageNum;
            break;
        case "의학과(M)":
        case "의예과(M)":
            noticeListUrl = String(url) + "?code=student&page=" + String(Number(pageNum) + 1) + "&keyfield=all&key=" + word;
            break;
        case "약학과(M)": 
            noticeListUrl = String(url) + "&page=" + String(Number(pageNum) + 1) + "&search_key=" + word;
            break;
        case "의용생체공학과(M)":
            noticeListUrl = String(url) + "&page=" + String(Number(pageNum) + 1) + "stx=" + word;
            break;
    }

    getNoticeListApart(major, <string>noticeListUrl, pageNum).then(result => {
        if (result) {
            console.log("GET NOTICE SEARCHED LIST:", major, "-", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
            res.status(200).json(result);
        } else {
            res.status(404).json({error: 'Notice: 데이터가 없습니다.'});
        }
    })

}

/* =============================== 공지 검색 리스트 끝 =============================== */ 


// 공지사항 게시글 컨텐츠 조회
export const getNoticeContent = async (req:Request, res:Response) => {
    let major = req.params.major;
    let board_no = Number(req.params.board_no);

    const major_apart = ["가천대학교", "소프트웨어", "자유전공", "글로벌경영학트랙", "AI", "첨단의료기기학과", "게임·영상학과", "게임", "디스플레이", "미래자동차", "의학과(M)", "의예과(M)", "약학과(M)", "의용생체공학과(M)"]
    let noticeListUrl = null
    let isAparted = false

    for (var ma in major_apart) {
        if(major.includes(major_apart[ma])) {
            isAparted = true 
            let modified_major = <string>getMajorNameApart(major);
            let url = String(await getApartedNoticeBaseUrl(modified_major))


            getNoticeContentApart(major_apart[ma], board_no, url).then(result => {
                if (result){
                    console.log("GET NOTICE CONTENT:", major, "/", board_no, "/", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                    res.status(200).send(result)
                } else {
                    res.status(404).json({error: 'Notice: 데이터가 없습니다.'});
                }
            })
        }
    }
    if (!isAparted) {

        let major_code = await getMajorCode(major);
        noticeListUrl = process.env.notice_link+"mode=view&boardType_seq="+String(major_code)+"&board_no="+board_no+"&approve=&secret=&answer=&branch=&searchopt=&searchword=&pageSize=10&pageNum=0"
        let result = await getClickedContentCommon(noticeListUrl)
        if (result) {
            console.log("GET NOTICE CONTENT:", major, "/", board_no, "/", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
            res.status(200).send(result);
        } else {
            res.status(404).json({error: 'Notice: 데이터가 없습니다.'});
        }
    }
};


// 공통 홈페이지 학과 공지 컨텐츠 조최
const getClickedContentCommon = async (url: string) => {
    const res = await axios.get(url);
    const html = res.data;
    let $ = cheerio.load(html);
    let base_url = url.substring(0, url.indexOf("kr")+2)
    
    try {
        
        // 이미지 
        $('.boardview > table tbody').find('img').each((index, elem) => {
            let imgurl = $(elem).attr("src")
            
            if (imgurl != null && (imgurl.substr(0, 7) == "/board/" || imgurl.substr(0, 8) == "/images/" || imgurl.substr(0, 7) == "/Files/")) {
                var href = imgurl + $(elem).attr("href")
                href.replace("&amp;", "&")
                $(elem).attr("src", base_url+imgurl)
            }

        })
        // 첨부파일
        $('.boardview > table tbody').find('a').each((index, elem) => {
            var file_url = $(elem).attr("href")
            if (file_url != null && file_url.substr(0, 7) == "/board/") {
                var href = base_url + $(elem).attr("href")
                href.replace("&amp;", "&")
                $(elem).attr("href", href)
            }
        })

        var result: Array<any> = [];
        $('.boardview > table tbody tr').each((index, elem) => {
            if(index == 4 || index == 5){
                result.push($(elem))
            }
        });
        var s: string = "<table>" + result.join("\n") + "</table>"



        const data = sanitizeHtml(<string>$(s).html(), {
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


// 별도 홈페이지 학과 공지 컨텐츠 조최 
const getNoticeContentApart = async(major: string, board_no: number, url: string) => {

    // let url: string

    switch(major) {
        case "가천대학교":
            try {
                url = url + "&mode=view&board_no=" + board_no;
                var data = await getClickedContentCommon(url)
                // callback(data)

                return new Promise( (resolve, reject) => {
                    if (data?.length == 0 || data == null) reject(new Error("no data"))
                    else resolve(data)
                })
            } catch(e) {
                console.log("getNoticePostingApart Error in Controller:", e)
            }
            break;
        case "소프트웨어":
        case "AI":
            try {
                url = url + "&idx=" + board_no;
                let base_url = url.substring(0, url.indexOf("kr")+2)
                const res = await axios.get(url);
                const html = res.data;
                let $ = cheerio.load(html);

                // 이미지 
                $('.cms-content .list-memo').find('img').each((index, elem) => {
                    var original_url = url.substring(0, url.indexOf("?"));

                    if(original_url.slice(-1) == '/')
                        original_url = original_url.substring(0, original_url.length-1);

                    let imgurl = <string>$(elem).attr("src")
                    processed_url = original_url;

                    while(imgurl.substr(0, 2) == "..") {
                        var divider = processed_url.split("/");
                        var processed_url: string = processed_url.substring(0, processed_url.indexOf(divider[divider.length - 1]));
                        imgurl = imgurl.substring(3)
                        if (processed_url.slice(-3) == "kr/")
                            break;
                    }
                    $(elem).attr("src", processed_url+imgurl)
                })
                // 첨부파일 
                $('.cms-content .list-memo').find('.attach a').each((index, elem) => {
                    var href = base_url+$(elem).attr("href")
                    $(elem).attr("href", href)
                })

                const data = sanitizeHtml(<string>$('.cms-content .list-memo').html(), {
                    allowedTags: false,
                    allowedAttributes: false,
                    parser: {
                        decodeEntities: true
                    }
                });
                return new Promise( (resolve, reject) => {
                    if (data?.length == 0 || data == null) reject(new Error("no data"))
                    else resolve(data)
                })
            } catch (e) {
                console.log(e)
            }
            break;
        case "자유전공":
            try {
                url = url + "_view?uid=" + board_no;
                let base_url = url.substring(0, url.indexOf("kr")+2)
                const res = await axios.get(url);
                const html = res.data;
                let $ = cheerio.load(html);

                // 이미지 
                $('.free_box .free_topTable tbody tr').find('img').each((index, elem) => {
                    var original_url = url.substring(0, url.indexOf("?"));

                    if(original_url.slice(-1) == '/')
                        original_url = original_url.substring(0, original_url.length-1);

                    let imgurl = <string>$(elem).attr("src")
                    processed_url = original_url;

                    while(imgurl.substr(0, 2) == "..") {
                        var divider = processed_url.split("/");
                        var processed_url: string = processed_url.substring(0, processed_url.indexOf(divider[divider.length - 1]) - 1);
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
                    if(String($(elem).attr('href')).substring(0, 4) != "http"){
                        var href = base_url + '/notice/' + $(elem).attr("href")
                        href.replace("&amp;", "&")
                        $(elem).attr("href", href)
                    }
                })

                // 등록일, 조회수 제외
                var tmp: Array<any> = []
                $('.free_box .free_topTable tbody tr').each((index, elem) => {
                    if(index != 0 ){
                        tmp.push($(elem))
                    }
                });
                var s = "<table>" + tmp.join("\n") + "</table>"
                const data = sanitizeHtml(String($(s).html()), {
                    allowedTags: false,
                    allowedAttributes: false,
                    parser: {
                        decodeEntities: true
                    }
                });
                return new Promise( (resolve, reject) => {
                    if (data?.length == 0 || data == null) reject(new Error("no data"))
                    else resolve(data)
                })
            } catch (e) {
                console.log(e)
            }
            break;
        case "글로벌경영학트랙":
            try {
                url = url.slice(0, -5) + "_view?uid=" + board_no;
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

                    let imgurl = <string>$(elem).attr("src")
                    processed_url = original_url;

                    console.log(imgurl)
                    if(imgurl.substr(0, 4) != "http" && imgurl.substr(0, 4) != "data"){
                        while(imgurl.substr(0, 2) == "..") {
                            var divider = processed_url.split("/");
                            var processed_url = <string>processed_url.substring(0, processed_url.indexOf(divider[divider.length - 1]) - 1);
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
                    var divider = String($(elem).attr("href")).indexOf('?')
                    if(String($(elem).attr('href')).substring(0, divider) == "filedown"){
                        var href = base_url + '/global/community/' + $(elem).attr("href")
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
                var s = "<table>" + tmp.join("\n") + "</table>"
                const data = sanitizeHtml(<string>$(s).html(), {
                    allowedTags: false,
                    allowedAttributes: false,
                    parser: {
                        decodeEntities: true
                    }
                });
                return new Promise( (resolve, reject) => {
                    if (data?.length == 0 || data == null) reject(new Error("no data"))
                    else resolve(data)
                })
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
                url = url + "?mode=view&board_no=" + board_no;
                let base_url = url.substring(0, url.indexOf("kr")+2)
                const res = await axios.get(url);
                const html = res.data;
                let $ = cheerio.load(html);

                // 이미지 
                $('.container .boardview table tbody').find('img').each((index, elem) => {
                    let imgurl = $(elem).attr("src")

                    $(elem).attr("src", base_url+imgurl)

                })
                // 첨부파일
                $('.container .boardview table tbody').find('a').each((index, elem) => {
                    var file_url = $(elem).attr("href")
                    if (file_url != null && file_url.substr(0, 7) == "/board/") {
                        var href = base_url + $(elem).attr("href")
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
                s = "<table>" + tmp.join("\n") + "</table>"
                const data = sanitizeHtml(<string>$(s).html(), {
                    allowedTags: false,
                    allowedAttributes: false,
                    parser: {
                        decodeEntities: true
                    }
                });
                return new Promise( (resolve, reject) => {
                    if (data?.length == 0 || data == null) reject(new Error("no data"))
                    else resolve(data)
                })
            } catch (e) {
                console.log(e)
            }
            break;
        case "의학과(M)":
        case "의예과(M)":
            try {
                url = url.split("-")[0] + "-view.php?code=student&body=view&number=" + board_no;
                let base_url = url.substring(0, url.indexOf("kr")+2)
                const res = await axios.get(url);
                const html = res.data;
                let $ = cheerio.load(html);

                // 이미지 
                $('#contents table tbody').find('img').each((index, elem) => {
                    let imgurl = <string>$(elem).attr("src")
                    if(imgurl.substr(0, 1) == '/') {
                        $(elem).attr("src", base_url+imgurl)
                    }
                })
                // 첨부파일
                $('#contents table tbody').find('a').each((index, elem) => {
                    var file_url = $(elem).attr("href")
                    if (file_url != null && file_url.substr(0, 1) == "/") {
                        var href = base_url + $(elem).attr("href")
                        href.replace("&amp;", "&")
                        $(elem).attr("href", href)
                    }
                })

                const data = sanitizeHtml(<string>$('#contents table tbody').html(), {
                    allowedTags: false,
                    allowedAttributes: false,
                    parser: {
                        decodeEntities: true
                    }
                });
                return new Promise( (resolve, reject) => {
                    if (data?.length == 0 || data == null) reject(new Error("no data"))
                    else resolve(data)
                })
            } catch (e) {
                console.log(e)
            }
            break;
        case "약학과(M)": 
            try {
                url = url.slice(0, -8) + "read.htm?list_mode=board&board_code=sub4_1&idx=" + board_no;
                let base_url = url.substring(0, url.indexOf("shop/")+5)
                const res = await axios.get(url);
                const html = res.data;
                let $ = cheerio.load(html);
                
                // 첨부파일
                $('.ViewTable > tbody > tr > td > table').find('a').each((index, elem) => {
                    var file_url = $(elem).attr("href")
                    if (file_url != null && file_url.substring(0, 24) == "javascript:file_download") {
                        var href = base_url + "file_download.php?board_code=sub4_1&board_idx=" + board_no +"&sel_no=" + file_url.substr(file_url.indexOf("(")+1, 1)
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
                var s = "<table>" + tmp.join("\n") + "</table>"
                const data = sanitizeHtml(<string>$(s).html(), {
                    allowedTags: false,
                    allowedAttributes: false,
                    parser: {
                        decodeEntities: true
                    }
                });
                return new Promise( (resolve, reject) => {
                    if (data?.length == 0 || data == null) reject(new Error("no data"))
                    else resolve(data)
                })
            } catch (e) {
                console.log(e)
            }
            break;
        case "의용생체공학과(M)":
            try {
                url = url + "&wr_id=" + board_no;
                const res = await axios.get(url);
                const html = res.data;
                let $ = cheerio.load(html);

                // 제목 제외
                var tmp = [];
                $('#bo_v').children('section').each((index, elem) => {
                    tmp.push($(elem))
                });
                var s = "<article>" + tmp.join("\n") + "</article>"
                const data = sanitizeHtml(<string>$(s).html(), {
                    allowedTags: false,
                    allowedAttributes: false,
                    parser: {
                        decodeEntities: true
                    }
                });
                return new Promise( (resolve, reject) => {
                    if (data?.length == 0 || data == null) reject(new Error("no data"))
                    else resolve(data)
                })
            } catch (e) {
                console.log(e)
            }
            break;
            // break;
    }

} 


/* =============================== 공지 컨텐츠 조회 끝 =============================== */ 



// 공지사항 게시글 URL
export const getNoticeUrl = async (req:Request, res:Response) => {
    let major = req.params.major;
    let board_no = Number(req.params.board_no);

    const major_apart = ["가천대학교", "소프트웨어", "자유전공", "글로벌경영학트랙", "AI", "첨단의료기기학과", "게임·영상학과", "게임", "디스플레이", "미래자동차", "의학과(M)", "의예과(M)", "약학과(M)", "의용생체공학과(M)"]
    let isAparted = false
    for (var ma in major_apart) {
        if (major.includes(major_apart[ma])) {
            isAparted = true

            let modified_major = <string>getMajorNameApart(major);
            let url = String(await getApartedNoticeBaseUrl(modified_major))
            
            getNoticeUrlApart(major_apart[ma], board_no, url).then(result => {
                if (result) {
                    console.log("GET NOTICE CONTENT URL:", major, "/", board_no, "/", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
                    res.status(200).send(result);
                } else {
                    res.status(404).json({error: 'Notice: 데이터가 없습니다.'});
                }
            })
        }
    }
    if (!isAparted) {

        let major_code = await getMajorCode(major);
        const url = process.env.notice_link+"mode=view&boardType_seq="+String(major_code)+"&board_no="+board_no+"&approve=&secret=&answer=&branch=&searchopt=&searchword=&pageSize=10&pageNum=0"
                     
        
        if (url) {
            console.log("GET NOTICE CONTENT URL:", major, "/", board_no, "/", new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
            res.status(200).send(url);
        } else {
            res.status(404).json({error: 'Notice: 데이터가 없습니다.'});
        }
    }

};



// // 별도 홈페이지 학과 공지 컨텐츠 URL 조회
const getNoticeUrlApart = async (major: string, board_no: number, notice_url: string) => {

  
    switch(major) {
        case "가천대학교":
            notice_url = notice_url + "&mode=view&board_no=" + board_no;
            break;
        case "소프트웨어":
        case "AI":
            notice_url = notice_url + "&idx=" + board_no;
            break;
        case "자유전공":
            notice_url = notice_url + "_view?uid=" + board_no;
            break;
        case "글로벌경영학트랙":
            notice_url = String(notice_url).slice(0, -5) + "_view?uid=" + board_no;
            break;
        case "첨단의료기기":
        case "게임":
        case "게임·영상학과":
        case "디스플레이":
        case "미래자동차":
            // 홈페이지 자체 검색 기능 X
            notice_url = notice_url + "?mode=view&board_no=" + board_no;
            break;
        case "의학과(M)":
        case "의예과(M)":
            notice_url = String(notice_url).split("-")[0] + "-view.php?code=student&body=view&number=" + board_no;
            break;
        case "약학과(M)": 
            notice_url = String(notice_url).slice(0, -8) + "read.htm?list_mode=board&board_code=sub4_1&idx=" + board_no;
            break;
        case "의용생체공학과(M)":
            notice_url = notice_url + "&wr_id=" + board_no;
            break;
    }

    return notice_url;

};

/* =============================== 공지 컨텐츠 URL 조회 끝 =============================== */ 




// DB SELECT 시 학과 이름 변경
const getMajorNameApart = (major: String): String => {
    // let major = req.params.major;
    let modified_major: String;
    switch(major) {
        case "소프트웨어":
            modified_major = "소프트웨어학과"
            break;
        case "AI":
            modified_major = "AI학과"
            break;
        case "첨단의료기기":
            modified_major = "첨단의료기기학과"
            break;
        case "게임":
        case "게임·영상학과":
            modified_major = "게임·영상학과"
            break;
        case "디스플레이":
            modified_major = "디스플레이학과"
            break;
        case "미래자동차":
            modified_major = "미래자동차학과"
            break;
        default:
            modified_major = major;
    }
    return modified_major;
};

// DB에서 학과 코드 조회
const getMajorCode = async(major: String): Promise<String> => {
    const majorRepository = getRepository(Major);
    let major_code = (await majorRepository.findOne({
        where: {
            majorName: major
        }
    }))?.majorCode
    return String(major_code)
}

// DB에서 별도 홈페이지 학과 베이스 URL 조회
const getApartedNoticeBaseUrl = async(major: string): Promise<String> => {
    const noticeApartRepository = getRepository(NoticeApart);
    var res_apart = (await noticeApartRepository.findOne({
        where: {
            noticeMajor: major
        }
    }))?.noticeUrl;
    return String(res_apart)
}
