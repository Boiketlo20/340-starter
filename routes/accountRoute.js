// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')

//Route to build account login
router.get("/login", accountController.buildLogin)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//Route to build registration 
router.get("/register", accountController.buildRegister)

//Something
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

//Route to build Account Management View
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
//Process Account Management
//router.post("/")

module.exports = router;