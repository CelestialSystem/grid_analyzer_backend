import mysql from 'mysql';
import { username, password, host, database } from '../config';

function createConnection(callback) {
    console.log(username, password, host, database);
    var connection = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database,
    });

    return connection
}

export { createConnection }
