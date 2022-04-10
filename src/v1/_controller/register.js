'use strict';

const {validationResult} = require('express-validator')
const HttpStatusCode = require("../../../utils/statusCode");
const { pascalCase } =  require("pascal-case");
const bcrypt = require("bcryptjs");

module.exports = class registerController {
    constructor() {
        // include the DB class
        this.dbClass = require('../core/classes/class');
        this.mainClass = new this.dbClass();
    }

    register = async (request, response, next) => {
        try {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, data: errors.array()});
            }
            else
            {
                let email = request.body.email;

                let emailExist = await this.mainClass.dbSelect(`SELECT * FROM users WHERE email = ? LIMIT 1 `, [email])
            
                if(emailExist.status === true && emailExist.data != null ){
                    return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, error: {error_message: 'Email already taken'}});
                }else
                {
                    let splitInitials = email.split('@')
                    let name = pascalCase(splitInitials[0])
                    
                    let password = request.body.password; 
                    let salt = await bcrypt.genSalt(10);
                    let encryptedPassword = await bcrypt.hash(password, salt)
    
                    let insertRecord = {
                        name: name, 
                        email: email, 
                        password: encryptedPassword,                 
                    }
                    let dataInsert = await this.mainClass.dbInsert(`INSERT into users SET ? `,insertRecord);
    
                    if(dataInsert.data > 0){
                        return response.status(HttpStatusCode.CREATED).json({status: true, message: 'Registration successful', data: {name: name, email: email}});
                    }else{
                        return response.status(HttpStatusCode.BAD_REQUEST).json({status: false, error: {error_message: 'Error occured during registration. Please try again'}});
                    }
                }
            }
        }catch (e) {
            next(new Error(e.stack));
        }
    }
}