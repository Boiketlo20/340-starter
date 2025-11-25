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
  (req, res) => {
    res.status(200).send('login process')
  }
)

//Route to build registration 
router.get("/register", accountController.buildRegister)

//Something
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

module.exports = router;