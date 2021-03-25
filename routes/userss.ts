import { Router } from 'express';
import * as usersController from '../controllers/users';

export const usersRouter = Router();

// 사용자 등록
usersRouter.post("/", usersController.createUser)

// 사용자 확인 및 조회
usersRouter.post("/check", usersController.verifyUser)

// 닉네임 중복확인
usersRouter.get('/nickname/check/:nickname', usersController.getUserNicknameValidity)

// 닉네임 수정
usersRouter.put("/nickname", usersController.ModifyUserNickname)

// 시간표 조회
usersRouter.get('/timetable/:user_no/:year/:sem', usersController.getTimetable)

// 수업 url 조회
usersRouter.post('/subject-url', usersController.getSubjcetUrl)

// 푸시 메세지
usersRouter.post('/push-url', usersController.postPushMessage)

