const utilities = require("../utilities/") 
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver Account Management View
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  const reviews = await accountModel.getReviewsByAccId(accountData.account_id)
  const reviewsHTML = await utilities.buildReviewTable(reviews)
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    accountData,
    reviewsHTML,
    errors: null
  })
}

/* ****************************************
*  Deliver Update Account View
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = req.params.accountId
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    accountData,
    errors: null
  })
}

/* ****************************************
* Processing Update Account
* *************************************** */
async function updateAccount(req, res, next) {
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body

  const update = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (update) {
    // 1. Get updated data from database
    const refreshedAccount = await accountModel.getAccountById(account_id)
    delete refreshedAccount.account_password

    // 2. Build NEW JWT with fresh data
    const accessToken = jwt.sign(
      refreshedAccount,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    )

    // 3. Update cookie
    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    req.flash("notice", `The account information was successfully updated.`)
    return res.redirect("/account/")
  }
  req.flash("notice", "Sorry, the update failed.")
  res.redirect(`/account/update/${account_id}`)
}

/* ****************************************
*  Processing Update Password
* *************************************** */
async function updatePassword(req, res, next) {
  const {
    account_id,
    account_password
  } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)
  const update = await accountModel.updatePassword(account_id, hashedPassword)


  if (update) {

    const refreshedAccount = await accountModel.getAccountById(account_id)
    delete refreshedAccount.account_password

    const accessToken = jwt.sign(
      refreshedAccount,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    )

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 3600 * 1000
    })
    req.flash("notice", `The password was successfully updated.`)
    return res.redirect("/account/")
  }
  req.flash("notice", "Sorry, the update failed.")
  res.redirect(`/account/update/${account_id}`)
}

/* ****************************************
 *  Logout Process
 * ************************************ */
async function logout (req, res, next) {
  try {
    // Clear the JWT cookie
    res.clearCookie('jwt');
    
    n
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          console.error('Error destroying session:', err);
        }
      });
    }
    
    // Redirect to home page
    res.redirect('/');
  } catch (error) {
    console.error('Logout error:', error);
    res.redirect('/');
  }
}

/**************************************
 * Build Edit Review view
 ****************************************/
async function buildEditReview (req, res, next) {
  let nav = await utilities.getNav()
  const reviewId = req.params.reviewId
  const review = await accountModel.getReviewsById(reviewId)

  const itemName = `${review.inv_year} ${review.inv_make} ${review.inv_model}`

  res.render("account/edit-review", {
    title: "Edit " + itemName + " Review",
    nav, 
    review,
    errors: null,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateReview (req, res, next) {
  let nav = await utilities.getNav()
  const {
    review_id,
    review_text
  } = req.body

  const updateResult = await accountModel.updateReview(
    review_id,
    review_text
  )

  if (updateResult) {
    req.flash("notice", `The review was successfully updated.`)
    return res.redirect("/account/")
  }

  req.flash("notice", "Sorry, the update failed.")
  res.redirect(`/account/review/edit/${review_id}`)
}

/**************************************
 * Build delete inventory item view
 ****************************************/
async function buildDeleteReview (req, res, next) {
  let nav = await utilities.getNav()
  const reviewId = req.params.reviewId
  const review = await accountModel.getReviewsById(reviewId)
  const itemName = `${review.inv_year} ${review.inv_make} ${review.inv_model}`
  res.render("account/delete-review", {
    title: "Delete " + itemName +  " Review",
    nav,
    review,
    errors: null,
  })
}

/* ***************************
 *  Delete the Inventory Data
 * ************************** */
async function deleteReview (req, res, next) {
  const { review_id } = req.body
  const deleteResult = await accountModel.deleteReview(review_id)
 
  if (deleteResult) {
    req.flash("notice", `Review was successfully deleted.`)
    return res.redirect("/account/")
  }
  req.flash("notice", "Sorry, the delete failed.")
  return res.redirect(`/account/review/delete/${review_id}`) 
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin,
  buildAccountManagement, buildUpdateAccount,
  updateAccount, updatePassword, logout, buildEditReview, updateReview,
  buildDeleteReview, deleteReview}