"use strict";
class ErrorHandler {
    constructor(error) {
        return this.handler(error);
    }

    handler = (errorMessage) => {
        console.log(errorMessage)
        // split the error response
        let message = errorMessage.message.split(':');
        message = message[1].split('|');
        return {
            errorCode: message[0],
            errorMessage: {
                error: {
                    message: message[1]
                }
            }
        }
    }
}

module.exports = ErrorHandler;
