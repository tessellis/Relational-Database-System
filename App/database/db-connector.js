// database/db-connector.js

const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: ' ',
    password: ' ',
    database: ' '
});

module.exports.pool = pool;
