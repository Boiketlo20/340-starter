const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/**************************************
 * Build inventory by classification view
 ****************************************/
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildByClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + ' ' + "vehicles",
        nav,
        grid,
    })
}

/**************************************
 * Build inventory items view
 ****************************************/
invCont.buildInventoryItem = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const data = await invModel.getInventoryByInv_id(inv_id)
    const grid = await utilities.buildByIventoryGrid(data)
    let nav = await utilities.getNav()
    const modelName = data[0].inv_model
    const modelYear = data[0].inv_year
    const modelMake = data[0].inv_make
    res.render("./inventory/item", {
        title: modelYear + ' ' + modelMake + ' ' + modelName ,
        nav,
        grid,
    })
}

module.exports = invCont