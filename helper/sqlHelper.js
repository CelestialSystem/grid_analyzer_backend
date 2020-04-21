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

function getCount(tableName) {
    switch(tableName) {
        case "mega_5000": return 5000;
        case "mega_10000": return 10000; 
        case "mega_100000": return 100000; 
        case "mega_1000000": return 1000000; 
    }
}

export { getCount, createConnection }
