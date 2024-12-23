// database/db-connector.js

const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_elliste',
    password: 'fl0asfGyU0yp',
    database: 'cs340_elliste'
});

module.exports.pool = pool;