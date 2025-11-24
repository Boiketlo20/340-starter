const invModel = require("../models/inventory-model") //requires the iventory-model file so it can be used to get data from the database
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

/*****************************************
 * Build the login view 
 ******************************************/
Util.buildLoginView = async function () {
    let form =
    `<form>
        <label for="account_email"> Email: </label>
        <input type="text" id="account_email" name="account_email">

        <label for="account_password"> Password: </label>
        <input type="text" id="account_password" name="account_password">

        <input type="submit" value="Login">

        <div class="sign-up"> 
            <a>No account? <a href="../../inv/item/" >Sign-up</a></a> 
        </div>
        
        
    </form>`
    return form;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util