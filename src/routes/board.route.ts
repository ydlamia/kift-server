import Koa from 'koa';
import {route, GET, DELETE, POST} from 'awilix-koa';
import * as HttpStatus from 'http-status-codes';
import {DBService} from '../services/db.service';
import {EnvService} from '../services/env.service';
import {DBServiceClient, AppServerClient, EnvServiceClient} from '../modules';
import {AppServer} from '../server';
import mongodb from 'mongodb';

type MyDependencies = DBServiceClient & AppServerClient & EnvServiceClient;

interface Board {
    _id?: mongodb.ObjectID;
    title?: string;
    description?: string;
    writer?: string;
    writedate?: number;
    fix?: Boolean;
}

/**
 * @api {post} /api/v1/board/create 공지사항 작성 API
 * @apiVersion 0.0.0
 * @apiName board create
 * @apiGroup scorpion
 * @apiParam {string} title 공지사항 제목
 * @apiParam {string} description 공지사항 내용
 * @apiParam {string} writer 작성자
 * @apiParam {boolean} fix 상단고정 여부
 * @apiParamExample {json} Request-Example:
 *     {
 *      "title": "공지사항 제목입니다",
 *      "description" : "공지사항 내용입니다",
 *      "writer" : "admin@naver.com",
 *      "fix" : true
 *     }
 * @apiSampleUrl http://192.168.0.84:3002/api/v1/board/create
 * @apiSuccess {string} _id ObjectId
 * @apiSuccess {string} title 공지사항 제목
 * @apiSuccess {string} description 공지사항 내용
 * @apiSuccess {string} writer 작성자
 * @apiSuccess {number} writedate 작성일
 * @apiSuccess {boolean} fix 상단고정 여부
 */
/**
 * @api {get} /api/v1/board/adlist 관리자용 공지사항 리스트 출력 API
 * @apiVersion 0.0.0
 * @apiName board admin list
 * @apiGroup scorpion
 * @apiSampleUrl http://192.168.0.84:3002/api/v1/board/adlist
 * @apiSuccess {string} _id ObjectId
 * @apiSuccess {string} title 공지사항 제목
 * @apiSuccess {string} description 공지사항 내용
 * @apiSuccess {string} writer 작성자
 * @apiSuccess {number} writedate 작성일
 * @apiSuccess {boolean} fix 상단고정 여부
 */

/**
 * @api {get} /api/v1/board/list 사용자용 공지사항 리스트 출력 API
 * @apiVersion 0.0.0
 * @apiName board list
 * @apiGroup scorpion
 * @apiSampleUrl http://192.168.0.84:3002/api/v1/board/list
 * @apiSuccess {string} _id ObjectId
 * @apiSuccess {string} title 공지사항 제목
 * @apiSuccess {number} writedate 작성일
 */

/**
 * @api {get} /api/v1/board/read/:id 공지사항 상세보기
 * @apiVersion 0.0.0
 * @apiName board read
 * @apiGroup scorpion
 * @apiParam {string} id 상세보기할 해당 공지사항 ObjectId
 * @apiSampleUrl http://192.168.0.84:3002/api/v1/board/read/5de089d569296802f0982b44/
 * @apiSuccess {string} _id ObjectId
 * @apiSuccess {string} title 공지사항 제목
 * @apiSuccess {string} description 공지사항 내용
 * @apiSuccess {string} writer 작성자
 * @apiSuccess {number} writedate 작성일
 * @apiSuccess {boolean} fix 상단고정 여부
 */

/**
 * @api {post} /api/v1/board/update/:id 공지사항 수정 API
 * @apiVersion 0.0.0
 * @apiName board update
 * @apiGroup scorpion
 * @apiParam {string} id 상세보기할 해당 공지사항 ObjectId
 * @apiParam {string} title 공지사항 제목
 * @apiParam {string} description 공지사항 내용
 * @apiParam {string} writer 작성자
 * @apiParam {boolean} fix 상단고정 여부
 * @apiParamExample {json} Request-Example:
 *     {
 *      "title": "수정된 공지사항 제목입니다",
 *      "description" : "수정된 공지사항 내용입니다",
 *      "writer" : "admin2@naver.com",
 *      "writedate" : "19-11-20",
 *      "fix" : false
 *     }
 * @apiSampleUrl http://192.168.0.84:3002/api/v1/board/update/5de089d569296802f0982b44/
 * @apiSuccess {string} _id ObjectId
 * @apiSuccess {string} title 공지사항 제목
 * @apiSuccess {string} description 공지사항 내용
 * @apiSuccess {string} writer 작성자
 * @apiSuccess {number} writedate 작성일
 * @apiSuccess {boolean} fix 상단고정 여부
 */

/**
 * @api {delete} /api/v1/board/delete/:id 상세보기에서 해당 공지사항 삭제 API
 * @apiVersion 0.0.0
 * @apiName board delete one
 * @apiGroup scorpion
 * @apiSampleUrl http://192.168.0.84:3002/api/v1/board/delete/5de089d569296802f0982b44/
 * @apiParam {string} id 삭제할 해당 공지사항 ObjecgId
 */

/**
 * @api {delete} /api/v1/board/delete 2개 이상 공지사항 삭제 API
 * @apiVersion 0.0.0
 * @apiName board delete
 * @apiGroup scorpion
 * @apiParam {string} query 삭제할 공지사항 ObjectId 여러개
 * @apiParam {string} query 삭제할 공지사항 ObjectId 여러개
 * @apiSampleUrl http://192.168.0.84:3002/api/v1/board/delete?id=5de089d569296802f0982b44&id=5de0bc65188c5712c8e177ea
 * @apiParamExample {string[]} Request-Example:
 *     {
 *      "id": "5de089d569296802f0982b44",
 *      "id" : "5de0bc65188c5712c8e177ea"
 *     }
 */

@route('/api/v1/board')
export default class BoardAPI implements MyDependencies {
    constructor({dbService, appServer, envService}: MyDependencies) {
        this.dbService = dbService;
        this.appServer = appServer;
        this.envService = envService;
    }

    @route('/create')
    @POST()
    async create(ctx: Koa.Context) {
        const body = ctx.request.body;
        await this.dbService.performWithDB(async db => {
            const col = await db.collection<Board>(DBService.BoardCollection);
            const result = await col.insert({
                title: body.title,
                description: body.description,
                writer: body.writer,
                writedate: Date.now(),
                fix: body.fix === 'true' ? true : false
            });
            ctx.response.body = {result};
            ctx.response.status = HttpStatus.OK;
        });
    }

    //공지사항 목록을 위한 리스트 생성 for 관리자
    @route('/adlist')
    @GET()
    async adlist(ctx: Koa.Context) {
        await this.dbService.performWithDB(async db => {
            const col = await db.collection<Board>(DBService.BoardCollection);
            const result = await col
                .find({})
                .sort({writedate: -1})
                .toArray();
            ctx.response.body = {result};
            ctx.response.status = HttpStatus.OK;
            ctx.set('Access-Control-Allow-Origin', '*');
        });
    }

    @route('/list')
    @GET()
    async list(ctx: Koa.Context) {
        await this.dbService.performWithDB(async db => {
            const col = await db.collection<Board>(DBService.BoardCollection);
            const result = await col
                .find({}, {projection: {title: 1, writedate: 1}})
                .sort({writedate: -1})
                .toArray();
            ctx.response.body = {result};
            ctx.response.status = HttpStatus.OK;
            ctx.set('Access-Control-Allow-Origin', '*');
        });
    }

    //공지사항 상세보기
    @route('/read/:id')
    @GET()
    async read(ctx: Koa.Context) {
        const {id} = ctx.params;
        await this.dbService.performWithDB(async db => {
            const col = await db.collection<Board>(DBService.BoardCollection);
            const result = await col.findOne({_id: new mongodb.ObjectId(id)});
            ctx.set('Access-Control-Allow-Origin', '*');
            ctx.response.body = {result};
            ctx.response.status = HttpStatus.OK;
        });
    }

    @route('/update/:id')
    @POST()
    async update(ctx: Koa.Context) {
        const params = ctx.params;
        const body = ctx.request.body;
        await this.dbService.performWithDB(async db => {
            const col = await db.collection<Board>(DBService.BoardCollection);
            await col.findOneAndUpdate(
                {_id: new mongodb.ObjectId(params.id)},
                {
                    $set: {
                        title: body.title,
                        description: body.description,
                        writer: body.writer,
                        // writedate: Date.now(),
                        fix: body.fix === 'true' ? true : false
                    }
                }
            );
            const result = await col.findOne({_id: new mongodb.ObjectId(params.id)});
            ctx.response.body = {result};
            ctx.response.status = HttpStatus.OK;
        });
    }

    //상세보기에서 삭제할 경우
    @route('/delete/:id')
    @DELETE()
    async deleteone(ctx: Koa.Context) {
        const params = ctx.params;
        await this.dbService.performWithDB(async db => {
            const col = await db.collection<Board>(DBService.BoardCollection);
            const result = await col.remove({_id: new mongodb.ObjectId(params.id)});
            ctx.response.body = {result};
            ctx.response.status = HttpStatus.OK;
        });
    }

    //리스트에서 삭제할 경우
    @route('/delete')
    @DELETE()
    async delete(ctx: Koa.Context) {
        const {id} = ctx.request.query;
        await this.dbService.performWithDB(async db => {
            const col = await db.collection<Board>(DBService.BoardCollection);
            for (let i in id) {
                await col.remove({_id: new mongodb.ObjectId(id[i])});
            }
            const result = await col.find({}).toArray();
            ctx.response.body = {result};
            ctx.response.status = HttpStatus.OK;
        });
    }

    dbService: DBService;
    appServer: AppServer;
    envService: EnvService;
}
