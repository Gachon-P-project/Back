import { Router } from 'express';
import * as freeBoardsController from '../controllers/freeBoards';

export const boardsRouter = Router();

// * 자유 게시판
// 전체 게시글 조회(특정 페이지)
boardsRouter.get('/free/:flag/:user/:page', freeBoardsController.readList);

// 특정 게시글 조회
boardsRouter.get('/free/:flag/:user/:word/:page', freeBoardsController.readSomeList);
