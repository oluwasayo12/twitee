'use strict';

const {validationResult} = require('express-validator')
const HttpStatusCode = require("../../../utils/statusCode");

module.exports = class postCommentsController {

    constructor() {
        // include the DB class
        this.dbClass = require('../core/classes/class');
        this.mainClass = new this.dbClass();
    }

    postComments = async (request, response, next) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, data: errors.array()});
        } 
        
        try {

            let user = request.user
            let post_id = request.params.id
            let post_comment = request.body.comment
            let insertRecord = {
                com_user_id: user, 
                com_post_id: post_id, 
                com_post_comment: post_comment
            }
            let dataInsert = await this.mainClass.dbInsert(`INSERT into comments SET ? `,insertRecord);

            if(dataInsert.data > 0){
                return response.status(HttpStatusCode.CREATED).json({status: true, message: 'Comment posted'});
            }else{
                return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, error: {error_message: 'Error occured while posting comment. Please try again'}});
            }
            
        }catch (e) { 
            next(new Error(e.stack));
        }
    }

    getComments = async (request, response, next) => {
        try {
            let user = request.user
            let post_id = request.params.id
            let twits = await this.mainClass.dbSelect(`SELECT com_post_comment as comment, date_commented FROM comments WHERE com_post_id = ? AND com_user_id = ?  `, [post_id, user])

            return response.status(HttpStatusCode.OK).json({
                status: true, 
                message: 'Comments', 
                data: twits.data
            });
            
        }catch (e) { 
            next(new Error(e.stack));
        }
    }


}
