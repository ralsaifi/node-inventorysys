/*
* Products Route ***************************************************
* Here will run multible requests for create, read, update and delete
*/

const express = require('express');
const router = express.Router();
const database = require('../../database/database.class.js');
const validator = require('validator');

/** Get products page  ********************************************/
router.get('/', (req, res) => {
  res.status(200);

  let query = `SELECT products.* , suppliers.*, inventory.*, category.Description AS category, products.Id AS Id FROM products LEFT JOIN 
    category ON products.Category_id = category.Id LEFT JOIN
    inventory ON products.Id = inventory.Product_id 
    LEFT JOIN suppliers ON products.Supplier_id = suppliers.Id`;

  database.query(query, function(err, products){
    if(err) throw err;
      res.render('products/index.ejs', {products});
  });
});

/** Get specific product  ********************************************/
router.get('/view/:id', (req, res) => {
  productID = req.params.id;
  if(validator.isInt(productID)){
    let query = `SELECT products.*, suppliers.*, inventory.*, category.Description AS category, products.Id AS Id FROM products LEFT JOIN 
    category ON products.Category_id = category.Id LEFT JOIN
    inventory ON products.Id = inventory.Product_id 
    LEFT JOIN suppliers ON products.Supplier_id = suppliers.Id 
    WHERE products.Id = ${validator.toInt(productID)}`;

    database.query(query, function(err, records){
      if(err) throw err;

      if(records.length){
        let data = prepareData(records[0]);
        res.status(200);
        res.render('products/view.ejs', {data});
      } else {
        res.status(404);
        res.send('Page not found');
      }
    });
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** Get add product page ********************************************/
router.get('/add', (req, res) => {
  let data = prepareData({});
  let errors = {};
  res.status(200);
  res.render('products/add.ejs', {errors, data});
})

/** Process insert product ********************************************/
router.post('/add', (req, res) => {
  // user submitted data will be stored in req.body
  let errors = {};
  errors = validateProduct(req.body);
  let data = prepareData(req.body);
  // if no errors
  if(!Object.keys(errors).length){
    // Process request
    database.insert({table: 'products', data: data.product, callbackFunc(err, dbResponse){
      if(err) throw err;
      let prodID = dbResponse.insertId;
      data.inventory.Product_id = prodID;
      database.insert({table: 'inventory', data: data.inventory, callbackFunc(err, dbResponse){
        if(err) throw err;
          if(dbResponse.affectedRows){
            // sucess, redirect to the new product
            res.redirect(`view/${prodID}`);
          }
      }})
    }})

  } else {
    res.status(200);
    res.render('products/add.ejs', {errors, data}); 
  }
});

/** get Delete product page ************************************/
router.get('/delete/:id', (req, res) => {
  let productID = req.params.id;
  if(validator.isInt(productID)){
    database.selectById({table: 'products', id: productID, callbackFunc(err, records){
      if(err) throw err;
      if(records.length){
        let product = records[0];
        res.status(200);
        res.render('products/delete.ejs', {product});
      } else {
        res.status(404);
        res.send('Page not found');
      }
    }});
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** Process delete product page ************************/
router.post('/delete/:id', (req, res) => {
  let productID = req.params.id;
  if(validator.isInt(productID)){
    database.selectById({table: 'products', id: productID, callbackFunc(err, records){
      if(err) throw err;
      if(records.length){
        database.delete({table: 'products', id: productID, callbackFunc(err, dbResponse){
          if(err) throw err;
          if(dbResponse.affectedRows){
            database.query(`DELETE FROM inventory WHERE Product_id = ${productID} LIMIT 1`, (err, dbResponse) => {
              if(err) throw err;
              res.redirect('/inventory');
            });
          } else {
            res.status(404);
            res.send('Page not found');
          }
        }});
      } else {
        res.status(404);
        res.send('Page not found');
      }
    }});
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** get Update product page ********************************/
router.get('/update/:id', (req, res) => {
  let productID = req.params.id;
  if(validator.isInt(productID)){
    let query = `SELECT products.*, suppliers.*, inventory.*, category.Description AS category, products.Id AS Id FROM products LEFT JOIN 
    category ON products.Category_id = category.Id LEFT JOIN
    inventory ON products.Id = inventory.Product_id 
    LEFT JOIN suppliers ON products.Supplier_id = suppliers.Id 
    WHERE products.Id = ${validator.toInt(productID)}`;

    database.query(query, function(err, records){
      if(err) throw err;
      if(records.length){
        let data = prepareData(records[0]);
        let errors = {};
        res.status(200);
        res.render('products/update.ejs', {data, errors});
      } else {
        res.status(404);
        res.send('Page not found');
      }
    });
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** Process update product page ************************/
router.post('/update/:id', (req, res) => {
  let productID = req.params.id;
  if(validator.isInt(productID)){
    let query = `SELECT products.*, suppliers.*, inventory.*, category.Description AS category FROM products LEFT JOIN 
    category ON products.Category_id = category.Id LEFT JOIN
    inventory ON products.Id = inventory.Product_id 
    LEFT JOIN suppliers ON products.Supplier_id = suppliers.Id 
    WHERE products.Id = ${validator.toInt(productID)}`;

    database.query(query, function(err, records){
      if(err) throw err;
      if(records.length){
        let errors = validateProduct(req.body);
        let data = prepareData(req.body);
        data.product.Id = productID;

        res.status(200);

        if(!Object.keys(errors).length){
          database.update({table: 'products', id: productID, data: data.product, callbackFunc(err, dbResponse){
            if(err) throw err;
            if(dbResponse.affectedRows){
              // success 
              data.inventory.Product_id = productID;
              database.con.query(`UPDATE inventory SET ? WHERE Product_id = ? LIMIT 1`, [data.inventory, productID], function(err, dbResponse){
                if(err) throw err;
                res.redirect(`/inventory/view/${productID}`);
              });
            } else {
              res.send('Something went wrong');
            }
          }});
        } else {
          res.render('products/update.ejs', {data, errors});
        }
      } else {
        res.status(404);
        res.send('Page not found');
      }
    });
  } else {
    res.status(404);
    res.send('Page not found');
  }
});

/** prepare product data *********************************/
function prepareData(dbData){
  let data = {};
  data.product = {};
  data.category = {};
  data.supplier = {};
  data.inventory = {};

  data.product.Id = dbData.Id ;
  data.product.Description = dbData.Description ;
  data.product.Category_id = dbData.Category_id;
  data.product.RetailPrice = dbData.RetailPrice;
  data.product.Supplier_id = dbData.Supplier_id;

  data.inventory.Product_id = dbData.Id ? dbData.Id : 0;
  data.inventory.Quantity = dbData.Quantity;
  data.inventory.SupplierPrice = dbData.SupplierPrice;
  data.inventory.Warehouse_id = 1;

  data.supplier.Id = dbData.Supplier_id;
  data.supplier.CompanyName = dbData.CompanyName;
  data.supplier.ContactName = dbData.ContactName;

  data.category.Description = dbData.category;

  return data;
}

/** Product validation *********************************/
function validateProduct(product){
  let errors = {};

  if(validator.isEmpty(product.Description)){
    errors.Description = 'Name must not be empty';
  } else if(!validator.isLength(product.Description, {min: 3, max: 100})){
    errors.Description = 'Name must be between 3 and 100 characters long';
  }

  if(!validator.isInt(product.Quantity)){
    errors.Quantity = 'Quantity must be a number';
  } else if(!validator.isInt(product.Quantity, {min: 0, max: 10000})){
    errors.RetailPrice = 'Quantity must between minimum of 0 (no quantity) and maximum of 10000';
  }

  if(!validator.isFloat(product.RetailPrice)){
    errors.RetailPrice = 'Retail price must be a number';
  } else if(!validator.isFloat(product.RetailPrice, {min: 1, max: 10000})){
    errors.RetailPrice = 'Retail price must be minimum of 1 and maximum of 10000';
  }

  if(!validator.isFloat(product.SupplierPrice)){
    errors.SupplierPrice = 'Sale price must be a number';
  } else if(!validator.isFloat(product.SupplierPrice, {min: 1, max: 10000})){
    errors.SupplierPrice = 'Sale price must be minimum of 1 and maximum of 10000';
  }

  if(validator.isEmpty(product.Category_id)){
    errors.Category_id = 'Category ID cannot be empty';
  } else if(!validator.isInt(product.Category_id, {min: 1, max: 6})){
    errors.Category_id = 'Category must be between 1 and 6';
  }

  if(validator.isEmpty(product.Supplier_id)){
    errors.Supplier_id = 'Supplier ID cannot be empty';
  } else if(!validator.isInt(product.Supplier_id, {min: 1, max: 100})){
    errors.Supplier_id = 'Supplier ID must be between 1 and 100';
  }

  return errors;
}

module.exports = router;

