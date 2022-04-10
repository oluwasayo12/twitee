'use strict';

const {validationResult} = require('express-validator')
const HttpStatusCode = require("../../../utils/statusCode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = class loginController {

    constructor() {
        // include the DB class
        this.dbClass = require('../core/classes/class');
        this.mainClass = new this.dbClass();
    }

    login = async (request, response, next) => {
        try {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, data: errors.array()});
            }
            else
            {
                let email = request.body.email;
                let password = request.body.password

                let emailExist = await this.mainClass.dbSelect(`SELECT * FROM users WHERE email = ? LIMIT 1 `, [email])
            
                if(emailExist.status === true && emailExist.data == null ){
                    return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, error: {error_message: 'Invalid Credential Provided'}});
                }

                let passwordCheck = await bcrypt.compare(password, emailExist.data.password);
                if(!passwordCheck) return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, error: {error_message: 'Invalid Credential Provided'}});

                let token = jwt.sign({id: emailExist.data.id}, process.env.TOKEN_PASSWORD, { expiresIn: '30mins' });

                return response.status(HttpStatusCode.OK).json({
                    status: true, 
                    message: 'login successful', 
                    data: {
                        name: emailExist.data.name, 
                        email: emailExist.data.email,
                        token: token
                    }
                });
            }
            
        }catch (e) { 
            next(new Error(e.stack));
        }
    }
}