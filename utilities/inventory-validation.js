const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Adding a vehicle Validation Rules
  * ********************************* */
  validate.inventoryRules = () => {
    return [
      // make name is required and must be string
      body("inv_make")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a vehicle make name."), // on error this message is sent.
  
      // model name is required and must be string
      body("inv_model")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a vehicle model name."), // on error this message is sent.
  
      // description is required and cannot already exist in the DB
      body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("A valid description is required."),

      // image path is required and cannot already exist in the DB
      body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("A valid image URL is required."),

      // thumbnail path is required and cannot already exist in the DB
      body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail URL is required."),

      // price is required and cannot already exist in the DB
      body("inv_price")
      .trim()
      .notEmpty()
      .isFloat()
      .withMessage("Price must be a valid number(integer or decimal)"),

      // year is required and cannot already exist in the DB
      body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1000, max: 9999 })
      .withMessage("Year must be a 4-digit number"),

      // miles is required and cannot already exist in the DB
      body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must contain digits only"),

      // color is required and cannot already exist in the DB
      body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("A valid colour is required."),
    ]
  }


/* ******************************
 * Check data and return errors or continue adding vehicle
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  const classSelect = await utilities.classificationOptions()
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue editing inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body
  const classSelect = await utilities.classificationOptions()
   const itemData = await invModel.getInventoryByInv_id(inv_id)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id
    })
    return
  }
  next()
}

module.exports = validate