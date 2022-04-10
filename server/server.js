"use strict";

const express = require("express");
const server = express();
// include cors
const cors = require('cors');
// include body parser
const bodyParser = require( "body-parser" );


server.use(cors());
server.use( bodyParser.json() );

const bootstrap = require("./bootstrap");
const errorHandler = require('../src/v1/core/classes/error-handler');
const router = express.Router();
require('dotenv').config()



server.use(router);
bootstrap(server, router);

//handling none-existence routes
server.use( ( request, result, next ) => {
    next( {
        errorCode: 404,
        errorMessage: {
            error: {
                message: 'Not Found'
            }
        },
    });
} )



// handling and skipped system errors.
server.use( (error, request, response, next) => {
    if (error instanceof Error) {
        error = new errorHandler(error);
    }
    // const statusCode = error.errorCode;
    // const statusMessage = error.errorMessage;
    response.status(500).json(error);
} )
const app = server.listen(process.env.PORT || 9200);
console.log(`Server started on port -- ` + process.env.PORT);
