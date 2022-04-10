"use strict";
module.exports = class Functions {
    
    /**
     * Initiating DataBase Connection
     */
     dbConnect = () => {
        const mySql = require("mysql");
        this.dbConnection = mySql.createConnection({
            host: process.env.MYSQL_URI,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: '3306',
        });
        return this.dbConnection.connect((connectionError) => {
            console.log(connectionError);
            if (connectionError) new Error(connectionError);
        })
    };

    /**
     * Closes existing database connection
     */
    dbClose = () => {
        if (this.dbConnection) this.dbConnection.end();
    };

    dbX = (sqlQuery, sqlParameters = "") => {
        return new Promise((resolve, reject) => {
            if (!this.dbConnection) this.dbConnect();
            this.dbConnection.query(sqlQuery,sqlParameters,(error, sqlData) => {
                if (error) reject(new Error(error.sqlMessage));
                else if (Object.keys(sqlData).length === 0) resolve({status: true, data: null});
                else if (Object.keys(sqlData).length === 1) resolve({status: true, data: sqlData[0]});
                else resolve({status: true, data: sqlData});
            });
        });
    };

    dbCountChanges = (sqlQuery, sqlParameters = "", updateQuery=false) => {
        return new Promise((resolve, reject) => {
            if (!this.dbConnection) this.dbConnect();
            this.dbConnection.query(sqlQuery, sqlParameters,(error, sqlData) => {
                if (error) reject(new Error(error.sqlMessage));
                else (updateQuery ===true)? resolve(sqlData.affectedRows) : resolve(sqlData.insertId);
            });
        });
    };


    dbSelect = async (sqlQuery, sqlParameters="") => {
        let fetchedResult = await this.dbX(sqlQuery, sqlParameters);
        if (fetchedResult.status === false) throw new Error(fetchedResult.error.message);
        return {
            status: true,
            data: fetchedResult.data
        }
    }

    dbInsert = async (sqlQuery, sqlParameters="", updateQuery=false) => {
        let count = await this.dbCountChanges(sqlQuery,sqlParameters,updateQuery);
        if (count < 1) throw new Error(count);
        return {
            status: true,
            data: count
        }
    }

    dbDelete = async (sqlQuery, sqlParameters="", updateQuery=false) => {
        let count = await this.dbX(sqlQuery,sqlParameters,updateQuery);
        return {
            status: true,
            data: count.data.affectedRows
        }
    }

}