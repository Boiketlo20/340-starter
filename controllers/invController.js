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
    const classificationList = await utilities.classificationOptions()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationList,
      errors : null
    })
  } else {
    req.flash("notice", "Sorry, falied to add classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors : null
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
    const classificationList = await utilities.classificationOptions()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationList,
    })
  } else {
    const classificationList = await utilities.classificationOptions()
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

  const classificationList = await utilities.classificationOptions(
      itemData[0].classification_id
  )

  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList, 
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

  const classificationList = await utilities.classificationOptions(classification_id)

  req.flash("notice", "Sorry, the update failed.")
  res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + inv_make + " " + inv_model,
    nav,
    classificationList,   
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

/**************************************
 * Build delete inventory item view
 ****************************************/
invCont.buildDelete = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInv_id(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price
  })
}

/* ***************************
 *  Delete the Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const itemData = await invModel.getInventoryByInv_id(inv_id)
  const data = await invModel.deleteInventoryItems(inv_id)
 
  if (data) {
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    req.flash("notice", `${itemName} was successfully deleted.`)
    return res.redirect("/inv/")
  }
  req.flash("notice", "Sorry, the delete failed.")
  return res.redirect(`/delete/${inv_id}`) 
}


module.exports = invCont