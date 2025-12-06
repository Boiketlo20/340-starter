const invModel = require("../models/inventory-model") //requires the iventory-model file so it can be used to get data from the database
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/************************************
 * Constructs the nav HTML unordered list
 *************************************/
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Hope page">Home</a></li>'
    data.rows.forEach((row => {
        list+= "<li>"
        list+= '<a href="/inv/type/' + row.classification_id +
        '" title="See our inventory of ' + row.classification_name +
        ' vehicles">' + row.classification_name + "</a>"
        list += "</li>"
    }))
    list += "</ul>"
    return list
}


/*****************************************
 * Build the classification view HTML 
 ******************************************/
Util.buildByClassificationGrid = async function (data) {
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid+= '<a href="../../inv/item/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            + '"alt= "Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<h2>'
            grid += '<a href="../../inv/item/' + vehicle.inv_id + '" title="View'
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '<hr class="hide" />'
            grid += '</li>'
        })
        grid += '</ul>'
    }else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/*****************************************
 * Build the inventory items HTML 
 ******************************************/
Util.buildByIventoryGrid = async function (data) {
    let grid = `
        <div id="invItem-display">
            <img src="${data[0].inv_image}" alt="Image of ${data[0].inv_make} ${data.inv_model} on CSE Motors">
            <section class="details">
                <h2>${data[0].inv_make} ${data[0].inv_model} Details</h2>
                <div class="namePrice">
                    <hr />
                    <span>Price: $${new Intl.NumberFormat('en-US').format(data[0].inv_price)}</span>
                </div>
                <div class="desc">
                    <hr />
                    <span>Description: ${data[0].inv_description}</span>
                </div>
                <div class="color">
                    <hr />
                    <span>Color: ${data[0].inv_color}</span>
                </div>
                <div class="miles">
                    <hr />
                    <span>Miles: ${new Intl.NumberFormat('en-US').format(data[0].inv_miles)}</span>
                </div>
            </section>

        </div>`;
    return grid;
} 

/*******************************
 * Building the classification dropdown
 *******************************/
Util.classificationOptions = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList    
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
* Middleware to check account type
**************************************** */
Util.checkAccountType = (req, res, next) => {
    const accountData = res.locals.accountData

    if (!accountData){
        return res.redirect("/account/login")
    }

    if (accountData.account_type == "Client") {
        req.flash("Sorry, Employees or Admins only")
        return res.redirect("/account/login")
    }

    next()
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util