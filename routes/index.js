/*
* Home page ***************************************************
* This is where we will process data for the dashboard
*/
const express = require("express");
const database = require('../database/database.class.js');
const router = express.Router();

router.get('/', (req, res) => {
  let query = `SELECT c.*, COUNT(p.Id) AS total_p FROM 
  category AS c LEFT JOIN products AS p 
  ON p.Category_id = c.Id
  GROUP BY c.Id`;

  database.con.query(query, (err, categories) => {
    if(err) throw err;
    let query = `SELECT (SELECT COUNT(*) FROM products) AS total_products, 
    (SELECT COUNT(*) FROM suppliers) AS total_suppliers, 
    (SELECT COUNT(*) FROM staff) AS total_staff`;

    database.con.query(query, (err, dbResponse) => {
      if(err) throw err;
      let statistics = dbResponse[0];
      res.status(200);
      res.render('index.ejs', { categories, statistics, homepage: true });
    });
  });
});

module.exports = router;
