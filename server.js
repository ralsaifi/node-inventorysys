const express = require("express");
const mysql = require("mysql"); // I might not need it here
const ejs = require("ejs");
const path = require("path"); // Used for the test router for front-end
const app = express();

app.set("views", "./templates"); // change the default 'views' folder to 'templates'
app.engine("ejs", ejs.renderFile); // Set up a templating engine
app.use(express.urlencoded({ extended: false }));

/** Home page Router **************************************************************/
app.use("/", require("./routes/index"));

/** Products Router **************************************************************/
app.use("/inventory", require("./routes/products/index"));

/** Staff Router **************************************************************/
app.use("/staff", require("./routes/staff/index"));

/** Suppliers Router **************************************************************/
app.use("/suppliers", require("./routes/suppliers/index"));

/** Test Router for front end  **************************************************************/
app.use("/test", express.static(path.join(__dirname, "public")));

//create a port to get the processed env port number if not available then use 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
