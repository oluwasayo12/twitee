const jwt = require('jsonwebtoken')
const HttpStatusCode = require('../../../utils/statusCode')
const Errors = require('../../../utils/error')

const auth = (request, response, next)=>{
    const auth = request.headers.authorization
    if(!auth){
        return response.status(HttpStatusCode.UNAUTHORIZED).json({status: false, error: {error_message: 'Unauthorized'}});
    }
    try {
        const mainToken = auth.split(' ')[1]
        const isValid = jwt.verify(mainToken, process.env.TOKEN_PASSWORD)
        if(isValid && typeof isValid === 'object' && isValid.id){
            request.user = isValid.id
            return next()
        }else{
            return response.status(HttpStatusCode.UNAUTHORIZED).json({status: false, error: {error_message: 'Unauthorized'}});
        }
    } catch (error) {
        return response.status(HttpStatusCode.UNAUTHORIZED).json({status: false, error: {error_message: 'Unauthorized'}});
    }
}

module.exports = {
    auth
}