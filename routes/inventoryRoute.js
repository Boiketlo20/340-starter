// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/classification-validation')
const inventoryValidate = require("../utilities/inventory-validation")

//Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build inventory by inventory item detail view
router.get("/item/:inventoryId", invController.buildInventoryItem);

//Route to build management
router.get("/", invController.buildManagement);

//Route to adding classification
router.get("/addClassification", utilities.checkAccountType, utilities.handleErrors(invController.addClassification));

//post to the router
router.post('/addClassification',  utilities.checkAccountType, regValidate.classificationRules(), regValidate.checkClassData, utilities.handleErrors(invController.addingClassification))

//Route to adding vehicle in inventory
router.get("/addVehicle", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

//post to the router
router.post("/addVehicle", utilities.checkAccountType, inventoryValidate.inventoryRules(), inventoryValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))

// displaying inventory in table route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Editing inventory route
router.get("/edit/:inventoryId", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventory))

//processing edit inventory
router.post("/update/", utilities.checkAccountType, inventoryValidate.inventoryRules(), inventoryValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))

//Delete route
router.get("/delete/:inventoryId", utilities.checkAccountType, utilities.handleErrors(invController.buildDelete));

//Processing delete route
router.post("/remove/", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory));

//Route that to process adding review
router.post("/review", inventoryValidate.ReviewRules(), utilities.handleErrors(invController.addReview))

module.exports = router;