/**
 * This will contain all interaction with the database *******************
 * Some methods take objects as arguement
 * Methods take callback functions and attach error, response arguements
 * Validator module is used to validate/escape data
 */
const mysql = require("mysql");
const validator = require("validator");

class Database {
  constructor() {
    this.con = false; // will hold the connection
    this.connect();
  }

  /** Creates a connection *****************************************/
  connect() {
    this.con = mysql.createConnection({
      host: "****", // Database host
      user: "****", // Host user
      password: "****", // Database password
      database: "inventory_system", // Database name
    });

    this.con.connect((err) => {
      if (err) throw err;
    });
  }

  disconnect() {
    this.con.end();
  }

  /** Query to run any query ************************************/
  // Query method will take the query as a string and a callback function,
  // the callback function will have access to two parameters, err and results
  query(query, callbackFunc) {
    this.con.query(query, callbackFunc);
  }

  /** SELECT ALL *********************************************/
  selectAll({ table, limit, callbackFunc }) {
    let query = `SELECT * FROM ${mysql.escapeId(table)} ${
      limit ? "LIMIT" + mysql.escape(limit) : ""
    }`;
    this.con.query(query, callbackFunc);
  }

  /** SELECT BY ID *******************************************/
  selectById({ table, id, callbackFunc }) {
    let query = `SELECT * FROM ?? WHERE Id = ?`;
    this.con.query(query, [table, id], callbackFunc);
  }

  /** INSERT *******************************************/
  insert({ table, data, callbackFunc }) {
    let query = `INSERT INTO ?? SET ?`;
    this.con.query(query, [table, data], callbackFunc);
  }

  /** DELETE ******************************************/
  delete({ table, id, callbackFunc }) {
    let query = `DELETE FROM ?? WHERE Id = ? LIMIT 1`;
    this.con.query(query, [table, id], callbackFunc);
  }

  /** UPDATE ****************************************/
  update({ table, id, data, callbackFunc }) {
    let query = `UPDATE ?? SET ? WHERE Id = ? LIMIT 1`;
    this.con.query(query, [table, data, id], callbackFunc);
  }
}

const database = new Database();

module.exports = database;
