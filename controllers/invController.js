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
    if (data.length === 0) {
      return res.status(200).render("inventory/classification", {
        title: "No vehicles found",
        nav,
        grid,
      })
    }
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

/**************************************
 * Build inventory management view
 ****************************************/
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.classificationOptions()
    res.render("./inventory/management", {
        title: "Vehicle Management" ,
        nav,
        classificationList,
    })
}

/**************************************
 * Build adding classification view
 ****************************************/
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}


/* ****************************************
*  Process Adding Classification
* *************************************** */
invCont.addingClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.newClassification(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added!.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, falied to add classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Registration",
      nav,
    })
  }
}

/**************************************
 * Build add vehicle view
 ****************************************/
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.classificationOptions()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null
  })
}

/* ****************************************
*  Process Vehicle Data
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.classificationOptions()
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.newInventoryItem(
     inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Add New Classification",
      nav,
      classificationList,
    })
  } else {
    req.flash("notice", "Sorry, adding vehicle to iventory failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/**************************************
 * Build edit inventory view
 ****************************************/
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInv_id(inv_id)

  // FIXED: pass correct classification_id
  const classificationList = await utilities.classificationOptions(
      itemData[0].classification_id
  )

  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,  // <-- correct name
    errors: null,
    ...itemData[0]
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    req.flash("notice", `The ${updateResult.inv_make} ${updateResult.inv_model} was successfully updated.`)
    return res.redirect("/inv/")
  }

  // FIXED: use same name the view expects
  const classificationList = await utilities.classificationOptions(classification_id)

  req.flash("notice", "Sorry, the update failed.")
  res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + inv_make + " " + inv_model,
    nav,
    classificationList,   // <--- FIXED
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  })
}

module.exports = invCont