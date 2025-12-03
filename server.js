/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const express = require("express")
const expressLayouts = require("express-ejs-layouts") //imports the package so we can use it
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")

/****************************************
 * Middleware
 ****************************************/
app.use(session({ //invokes app.use() function and indicates the session is to be applied
  store: new (require('connect-pg-simple')(session))({ //store refers to where the session data will be stores
    createTableIfMissing : true, //tells the session to create a 'session' table in the database if it does not already exist
    pool, //uses database connection pool to interact with database server
  }),
  secret: process.env.SESSION_SECRET, //indicates a 'secret' name - value pair that will be used to protect the session
  resave: true, //because we are using 'flash' messages we need to resave the session table after each message, so it must be set to true
  saveUninitialized: true, //setting is important to the creation process when the session is first created
  name: 'sessionId', //name we are assigning to the unique 'id' that will be created for each session
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())
app.use(utilities.checkJWTToken)

// Express Messages Middleware
app.use(require('connect-flash')()) //requires connect-flash package
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res) //'express-messages' package is required as a function. The function accepts the request and response objects as parameters. The functionality of this function is assigned to the response object using the "locals" option and a name of the "mesaages". This allows any message to be stores into the response, making it available in a view
  next() //cals the next90 function, passing control to the next piece of middleware in the application
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs") //declaring the ejs will be the view engine for our app
app.use(expressLayouts) //tells the app to use the express-ejs-layouts package
app.set("layout", "./layouts/layout") //says when the express ejs layout goes looking for basic template for a view, it will be be found in a layouts folder, and the template will be named 'layout'

/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
//Inventory routes
app.use("/inv", inventoryRoute)
//Account route
app.use("/account", accountRoute)
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})