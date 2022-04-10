'use strict';

const {validationResult} = require('express-validator')
const HttpStatusCode = require("../../../utils/statusCode");
const moment = require('moment');

module.exports = class postsController {

    constructor() {
        // include the DB class
        this.dbClass = require('../core/classes/class');
        this.mainClass = new this.dbClass();
    }

    getTwits = async (request, response, next) => {
        try {

            let twits = await this.mainClass.dbSelect(`SELECT post_id as twit_id, name, post_data, com_post_comment as comment, date_posted FROM posts LEFT JOIN users ON post_user_id = id `)
            return response.status(HttpStatusCode.OK).json({
                status: true, 
                message: 'Twits', 
                data: twits.data
            });
            
        }catch (e) { 
            next(new Error(e.stack));
        }
    }

    postTwit = async (request, response, next) => {

        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, data: errors.array()});
        }

        try {

            let user = request.user
            let twit = request.body.twit
            let datePosted = moment().format('YYYY-MM-DD HH:mm:ss');
            let insertRecord = {
                post_user_id: user, 
                post_data: twit, 
                date_posted: datePosted,                 
            }
            let dataInsert = await this.mainClass.dbInsert(`INSERT into posts SET ? `,insertRecord);

            if(dataInsert.data > 0){
                return response.status(HttpStatusCode.CREATED).json({status: true, message: 'Twit posted'});
            }else{
                return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, error: {error_message: 'Error occured while posting twit. Please try again'}});
            }
            
        }catch (e) { 
            next(new Error(e.stack));
        }
    }

    deleteTwit = async (request, response, next) => {
        try {

            let user = request.user
            let twitId = request.params.id

            let deleteTwit = await this.mainClass.dbDelete(`DELETE FROM posts WHERE post_id = ? AND post_user_id = ? `,[twitId, user]);

            if(deleteTwit.data > 0){
                return response.status(HttpStatusCode.OK).json({status: true, message: 'Twit Deleted'});
            }else{
                return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, error: {error_message: 'Unable to delete twit.'}});
            }
            
        }catch (e) { 
            next(new Error(e.stack));
        }
    }

}
