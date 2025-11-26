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
router.get("/addClassification", invController.addClassification);

//post to the router
router.post('/addClassification', regValidate.classificationRules(), regValidate.checkClassData, utilities.handleErrors(invController.addingClassification))

//Route to adding vehicle in inventory
router.get("/addVehicle", utilities.handleErrors(invController.buildAddInventory));

//post to the router
router.post("/addVehicle", inventoryValidate.inventoryRules(), inventoryValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))

module.exports = router;