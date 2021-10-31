/*
* Staff Routes ***************************************************
* Here will run multible requests for create, read, update and delete
*/

const express = require('express');
const validator = require('validator');
const router = express.Router();
const database = require('../../database/database.class');

/** Serve staff page *******************************************/
router.get('/', (req, res) => {
  database.selectAll({table: 'staff', callbackFunc(err, staff){
    if(err) throw err;
    res.status(200);
    res.render('staff/index.ejs', {staff});
  }})
});

/** Serve staff member page *******************************************/
router.get('/view/:id', (req, res) => {
  let staffID = req.params.id;
  if(validator.isInt(staffID)){
    database.selectById({table: 'Staff', id: staffID, callbackFunc(err, staff){
      if(err) throw err;
      if(staff.length){
        staff = staff[0];
        res.status(200);
        res.render('staff/view.ejs', {staff});
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

/** Serve staff member delete page *******************************************/
router.get('/delete/:id', (req, res) => {
  let staffID = req.params.id;
  if(validator.isInt(staffID)){
    database.selectById({table: 'Staff', id: staffID, callbackFunc(err, staff){
      if(err) throw err;
      if(staff.length){
        staff = staff[0];
        res.status(200);
        res.render('staff/delete.ejs', {staff});
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

/** Process delete staff *******************************************/
router.post('/delete/:id', (req, res) => {
  let staffID = req.params.id;
  if(validator.isInt(staffID)){
    database.selectById({table: 'Staff', id: staffID, callbackFunc(err, staff){
      if(err) throw err;
      if(staff.length){
        database.delete({table: 'Staff', id: staffID, callbackFunc(err, dbResponse){
          if(err) throw err;
          if(dbResponse.affectedRows){
            res.redirect('/staff');
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

/** serve add staff page *******************************************/
router.get('/add', (req, res) => {
  let staff = {};
  let errors = {};
  res.status(200);
  res.render('staff/add.ejs', {staff, errors});
});

/** process add staff request *******************************************/
router.post('/add', (req, res) => {
  let errors = validateData(req.body);
  let staff = prepareData(req.body);
  if(!Object.keys(errors).length){
    database.insert({table: 'Staff', data: staff, callbackFunc(err, dbResponse){
      if(err) throw err;
      if(dbResponse.affectedRows){
        res.status(200);
        res.redirect(`view/${dbResponse.insertId}`);
      }
    }});
  } else {
    res.status(200);
    res.render('staff/add.ejs', {staff, errors});
  }
});

/** Serve staff member update page *******************************************/
router.get('/update/:id', (req, res) => {
  let staffID = req.params.id;
  if(validator.isInt(staffID)){
    database.selectById({table: 'Staff', id: staffID, callbackFunc(err, staff){
      if(err) throw err;
      if(staff.length){
        staff = prepareData(staff[0]);
        errors = {};
        res.status(200);
        res.render('staff/update.ejs', {staff, errors});
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

/** process update staff *******************************************/
router.post('/update/:id', (req, res) => {
  let staffID = req.params.id;
  if(validator.isInt(staffID)){
    database.selectById({table: 'Staff', id: staffID, callbackFunc(err, staff){
      if(err) throw err;
      if(staff.length){
        errors = validateData(req.body);
        staff = prepareData(req.body);
        res.status(200);
        if(!Object.keys(errors).length){
          database.update({table: 'Staff', id: staffID, data: staff, callbackFunc(err, dbResponse){
            if(err) throw err;
            if(dbResponse.affectedRows){
              res.redirect(`/staff/view/${staffID}`);
            }
          }})
        } else {
          res.render('staff/update.ejs', {staff, errors});
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

/** Validate staff data **********************************************/
function validateData(data){
  let errors = {};

  if(validator.isEmpty(data.Name)){
    errors.name = 'Name must not be empty';
  } else if(!validator.isLength(data.Name, {min: 3, max: 100})){
    errors.name = 'Name must be between 3 and 100 characters long';
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

  return errors;
}

/** prepare data **********************************************/
function prepareData(data){
  let staff = {};
  staff.Name = data.Name;
  staff.Email = data.Email;
  staff.Phone = data.Phone;
  staff.Warehouse_id = 0;

  return staff;
}



module.exports = router;