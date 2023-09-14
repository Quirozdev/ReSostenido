const mysql = require('mysql2');

const db = mysql
  .createPool({
    host: 'localhost',
    user: 'root',
    database: 'resostenido',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })
  .promise();

module.exports = db;
