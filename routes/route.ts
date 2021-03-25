import { Router } from 'express';
import { boardsRouter } from './boardss'
import { noticesRouter } from './noticess'
import { usersRouter } from './userss'
export const router = Router();

router.use('/boards', boardsRouter)

router.use('/notices', noticesRouter)

router.use('/users', usersRouter)