/*
* Categories Route ***************************************************
* Here will run multible requests for create, read, update and delete
*/

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200);
  res.render('index.ejs', { pageName: "Categories" });
});

module.exports = router;