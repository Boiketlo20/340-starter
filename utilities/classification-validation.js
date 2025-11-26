const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

/*  **********************************
  *  Adding Classification Validation Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      // classification is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
  }

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate