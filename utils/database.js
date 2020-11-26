const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'admin'
})

pool.on('connection', function (connection) {
    connection.on('enqueue', function (sequence) {
        if (sequence instanceof mysql.Sequences.Query) {
            console.log(sequence.sql);
        }
    });
});

module.exports = pool.promise();