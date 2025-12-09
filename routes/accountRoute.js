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

//Route to build update account
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdateAccount))

//Route to updating account
router.post("/update", regValidate.UpdateAccountRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))

//Route to updating password
router.post("/updating-password", regValidate.UpdatePasswordRules(), regValidate.checkPasswordData, utilities.handleErrors(accountController.updatePassword))

//Route to updating review
router.get("/review/edit/:reviewId", utilities.handleErrors(accountController.buildEditReview))
router.post("/review/update", regValidate.updateReviewRules(), regValidate.checkUpdateReview, utilities.handleErrors(accountController.updateReview))

//Route to deleting review
router.get("/review/delete/:reviewId", utilities.handleErrors(accountController.buildDeleteReview))
router.post("/review/remove", utilities.handleErrors(accountController.deleteReview))

router.get("/logout", accountController.logout);
module.exports = router;