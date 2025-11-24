// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require('../controllers/accountController')

//Route to build an accounts router file
router.get("/login", accountController.buildLogin)

module.exports = router;