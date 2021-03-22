import { Router } from 'express';
import { boardsRouter } from './boardss'
export const router = Router();

router.use('/boards', boardsRouter)
