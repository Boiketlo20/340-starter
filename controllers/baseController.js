//The "base" controller will be responsible only for requests to the application in general, and not to specific areas (such as inventory or accounts).
const utilities = require("../utilities/") //imports an index.js from a utilities folder
const baseController = {} //created an empty object 

baseController.buildHome = async function(req, res){ //This is a similar concept to creating a method within a class, where "baseController" would be the class name and "buildHome" would be the method. This function itslef accpets the request and response objects as parameters.
    const nav = await utilities.getNav() //calls a getNav() from utilities folder, the results when returned will be stores in nav variable
    res.render("index", {title: "Home", nav}) //Express command to use EJS to send the "index" view back to the client. The index view will need the title name - value pair, and the nav variable. The nav variable will contain the string of HTML code to render nav bar in application.
}

module.exports = baseController //exports object for use elsewhere