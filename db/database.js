const mysql = require('mysql2');

class Database {
  #connection;
  constructor({ host, port, user, password, databaseName }) {
    this.#connection = mysql
      .createPool({
        host,
        port,
        user,
        password,
        database: databaseName,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      })
      .promise();
  }

  getConnection() {
    return this.#connection;
  }

  async closeConnection() {
    this.#connection.end();
  }
}

module.exports = Database;
