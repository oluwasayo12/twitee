"use strict";
const v1 = require("../src/v1/_routes");

module.exports = (server, router) => {
    router.use("/v1", v1); // Route all traffic with v1 endpoint.
    router.get('/', (req, res, next) => {
        res.status(200).json({"statusCode": 200, "statusMessage": "OK"});
    });
};
