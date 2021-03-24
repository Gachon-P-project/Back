import { Router } from 'express';
import * as noticesController from '../controllers/notices';

export const noticesRouter = Router();

// 공지사항 리스트 조회
noticesRouter.get("/list/:page_num/:major", noticesController.getNoticeList)


// 공지사항 검색
noticesRouter.get("/list/:page_num/:major/:search", noticesController.getNoticeSearchedList)


// 공지사항 게시글 조회
noticesRouter.get("/posting/:major/:board_no", noticesController.getNoticeContent)


// 공지사항 게시글 URL
noticesRouter.get("/posting/url/:major/:board_no", noticesController.getNoticeUrl)

