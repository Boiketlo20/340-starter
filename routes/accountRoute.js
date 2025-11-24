// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require("../utilities/index")

//Route to build account login
router.get("/login", accountController.buildLogin)

//Route to build registration 
router.get("/register", accountController.buildRegister)

//Something
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;