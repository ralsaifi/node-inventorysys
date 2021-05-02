/*
* supplier Routes ***************************************************
* Here will run multible requests for create, read, update and delete
*/

const express = require('express');
const validator = require('validator');
const router = express.Router();
const database = require('../../database/database.class');

/** Serve supplier page *******************************************/
router.get('/', (req, res) => {
  database.selectAll({table: 'Suppliers', callbackFunc(err, suppliers){
    if(err) throw err;
    res.status(200);
    res.render('suppliers/index.ejs', {suppliers});
  }})
});

/** Serve supplier member page *******************************************/
router.get('/view/:id', (req, res) => {
  let supplierID = req.params.id;
  if(validator.isInt(supplierID)){
    database.selectById({table: 'Suppliers', id: supplierID, callbackFunc(err, suppliers){
      if(err) throw err;
      if(suppliers.length){
        suppliers = suppliers[0];
        res.status(200);
        res.render('suppliers/view.ejs', {suppliers});
      } else {
        res.status(404);
        res.send('Page not found');
      }
    }})
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** Serve supplier member delete page *******************************************/
router.get('/delete/:id', (req, res) => {
  let supplierID = req.params.id;
  if(validator.isInt(supplierID)){
    database.selectById({table: 'Suppliers', id: supplierID, callbackFunc(err, suppliers){
      if(err) throw err;
      if(suppliers.length){
        suppliers = suppliers[0];
        res.status(200);
        res.render('suppliers/delete.ejs', {suppliers});
      } else {
        res.status(404);
        res.send('Page not found');
      }
    }})
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** Process delete supplier *******************************************/
router.post('/delete/:id', (req, res) => {
  let supplierID = req.params.id;
  if(validator.isInt(supplierID)){
    database.selectById({table: 'Suppliers', id: supplierID, callbackFunc(err, suppliers){
      if(err) throw err;
      if(suppliers.length){
        database.delete({table: 'Suppliers', id: supplierID, callbackFunc(err, dbResponse){
          if(err) throw err;
          if(dbResponse.affectedRows){
            res.redirect('/suppliers');
          }
        }});
      } else {
        res.status(404);
        res.send('Page not found');
      }
    }})
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** serve add supplier page *******************************************/
router.get('/add', (req, res) => {
  let suppliers = {};
  let errors = {};
  res.status(200);
  res.render('suppliers/add.ejs', {suppliers, errors});
});

/** process add supplier request *******************************************/
router.post('/add', (req, res) => {
  let errors = validateData(req.body);
  let suppliers = prepareData(req.body);
  if(!Object.keys(errors).length){
    database.insert({table: 'Suppliers', data: suppliers, callbackFunc(err, dbResponse){
      if(err) throw err;
      if(dbResponse.affectedRows){
        res.status(200);
        res.redirect(`view/${dbResponse.insertId}`);
      }
    }});
  } else {
    res.status(200);
    res.render('suppliers/add.ejs', {suppliers, errors});
  }
});

/** Serve supplier member update page *******************************************/
router.get('/update/:id', (req, res) => {
  let supplierID = req.params.id;
  if(validator.isInt(supplierID)){
    database.selectById({table: 'Suppliers', id: supplierID, callbackFunc(err, suppliers){
      if(err) throw err;
      if(suppliers.length){
        suppliers = prepareData(suppliers[0]);
        errors = {};
        res.status(200);
        res.render('suppliers/update.ejs', {suppliers, errors});
      } else {
        res.status(404);
        res.send('Page not found');
      }
    }})
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** process update supplier *******************************************/
router.post('/update/:id', (req, res) => {
  let supplierID = req.params.id;
  if(validator.isInt(supplierID)){
    database.selectById({table: 'Suppliers', id: supplierID, callbackFunc(err, suppliers){
      if(err) throw err;
      if(suppliers.length){
        errors = validateData(req.body);
        suppliers = prepareData(req.body);
        res.status(200);
        if(!Object.keys(errors).length){
          database.update({table: 'Suppliers', id: supplierID, data: suppliers, callbackFunc(err, dbResponse){
            if(err) throw err;
            if(dbResponse.affectedRows){
              res.redirect(`/suppliers/view/${supplierID}`);
            }
          }})
        } else {
          res.render('suppliers/update.ejs', {suppliers, errors});
        }
      } else {
        res.status(404);
        res.send('Page not found');
      }
    }})
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** Validate supplier data **********************************************/
function validateData(data){
  let errors = {};

  if(validator.isEmpty(data.CompanyName)){
    errors.CompanyName = 'Company Name must not be empty';
  } else if(!validator.isLength(data.CompanyName, {min: 3, max: 100})){
    errors.CompanyName = 'Company Name must be between 3 and 100 characters long';
  }

  if(validator.isEmpty(data.ContactName)){
    errors.ContactName = 'Contact Name must not be empty';
  } else if(!validator.isLength(data.ContactName, {min: 3, max: 100})){
    errors.ContactName = 'Contact Name must be between 3 and 100 characters long';
  }

  if(validator.isEmpty(data.Address)){
    errors.address = 'Address Name must not be empty';
  } else if(!validator.isLength(data.Address, {min: 5, max: 100})){
    errors.address = 'Address Name must be between 5 and 100 characters long';
  }

  if(validator.isEmpty(data.Email)){
    errors.email = 'Email must not be empty';
  } else if(!validator.isEmail(data.Email)){
    errors.email = 'Email must be valid';
  }

  if(!validator.isInt(data.Phone)){
    errors.phone = 'Phone must be a number';
  } else if(!validator.isLength(data.Phone, {min: 9, max: 15})){
    errors.phone = 'number must be valid';
  }

  if(validator.isEmpty(data.Website)){
    errors.website = 'Website must not be empty';
  }

  return errors;
}

/** prepare data **********************************************/
function prepareData(data){
  let supplier = {};
  supplier.CompanyName = data.CompanyName;
  supplier.ContactName = data.ContactName;
  supplier.Address = data.Address;
  supplier.Email = data.Email;
  supplier.Phone = data.Phone;
  supplier.Website = data.Website;

  return supplier;
}



module.exports = router;