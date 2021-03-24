import { Router } from 'express';
import { boardsRouter } from './boardss'
import { noticesRouter } from './noticess'
export const router = Router();

router.use('/boards', boardsRouter)

router.use('/notices', noticesRouter)