import { Request, Response } from 'express';
import { Freeboard } from '../entities/Freeboard';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../entities/User';
import { Freereply } from '../entities/Freereply';
import { Likeboard } from '../entities/Likeboard';

// 전체 게시글 조회
// 클라이언트에서 board flag를 파라미터로 전달하면 해당하는 튜플을 전송
export const readList = async (req:Request, res:Response) => {
    let flag = Number(req.params.flag);
    let user = req.params.user;
    let page = Number(req.params.page);

    try {
        if (page >= 1) {
            page *= 10
        }

        if (flag == 1) {
            const freeboards = await getRepository(Freeboard)
            .createQueryBuilder("freeboard")
            .leftJoinAndSelect("freeboard.user", "user")
            .orderBy("freeboard.post_no", "DESC")
            .select(["freeboard", "user.nickname as nickname"])
            .addSelect(
                qb =>
                    qb
                     .select("COUNT(*)", "reply_cnt")
                     .from(Freereply, "reply")
                     .where("reply.post_no = freeboard.post_no"),
                "reply_cnt",
            )
            .addSelect(
                qb =>
                    qb
                     .select("COUNT(*)", "like_cnt")
                     .from(Likeboard, "like")
                     .where("like.post_no = freeboard.post_no")
                     .andWhere("like.board_flag = :flag", { flag: flag }),
                "like_cnt",
            )
            .addSelect(
                qb =>
                    qb
                     .select("COUNT(*)", "like_user")
                     .from(Likeboard, "like")
                     .where("like.user_no = :user", { user: user})
                     .andWhere("like.post_no = freeboard.post_no")
                     .andWhere("like.board_flag = :flag", { flag: flag }),
                "like_user",
            )
            .offset(page)
            .limit(10)
            .getRawMany();

            if (!freeboards) {
                res.status(404).json({error: '게시글이 없습니다.'})
            }
            res.status(200).json(freeboards)
        }
        
    } catch (err) {
        console.log(err);
    }
};

// 특정 게시글 조회
// 클라이언트에서 board flag / 특정값을 파라미터로 전달하면 해당하는 튜플을 전송한다.
export const readSomeList = async (req:Request, res:Response) => {
    let flag = Number(req.params.flag);
    let user = req.params.user;
    let word = req.params.word;
    let page = Number(req.params.page);

    try {
        if (page >= 1) {
            page *= 10
        }
        console.log("readSomeList");
        
        if (flag == 1) {
            const freeboards = await getRepository(Freeboard)
            .createQueryBuilder("freeboard")
            .leftJoinAndSelect("freeboard.user", "user")
            .orderBy("freeboard.post_no", "DESC")
            .select(["freeboard", "user.nickname as nickname"])
            .addSelect(
                qb =>
                    qb
                     .select("COUNT(*)", "reply_cnt")
                     .from(Freereply, "reply")
                     .where("reply.post_no = freeboard.post_no"),
                "reply_cnt",
            )
            .addSelect(
                qb =>
                    qb
                     .select("COUNT(*)", "like_cnt")
                     .from(Likeboard, "like")
                     .where("like.post_no = freeboard.post_no")
                     .andWhere("like.board_flag = :flag", { flag: flag }),
                "like_cnt",
            )
            .addSelect(
                qb =>
                    qb
                     .select("COUNT(*)", "like_user")
                     .from(Likeboard, "like")
                     .where("like.user_no = :user", { user: user})
                     .andWhere("like.post_no = freeboard.post_no")
                     .andWhere("like.board_flag = :flag", { flag: flag }),
                "like_user",
            )
            .where("freeboard.board_flag = :flag", { flag: flag })
            .andWhere("freeboard.post_contents like :word OR freeboard.post_title like :word", { word: `%${word}%`})
            .offset(page)
            .limit(10)
            .getRawMany();

            if (!freeboards) {
                res.status(404).json({error: '게시글이 없습니다.'})
            }
            res.status(200).json(freeboards)
        }
        
    } catch (err) {
        console.log(err);
    }
};


    