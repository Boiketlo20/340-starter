const pool = require("../database/") //imports the database connection file from the database folder

/**********************************
 * Get all classification data
 **********************************/
async function getClassifications(){ 
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") //will return the result of the SQL query, which will be sent to the database server using a pool connection
}

module.exports = {getClassifications} //Exports the function for use elsewhere

/***************************************************
 * Get all inventory items and classification_name by classification_id
 ****************************************************/
async function getInventoryByClassificationId(classification_id) {
   try{
     const data = await pool.query(
        `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
     )
     return data.rows
    } catch(error){
        console.error("getclassificationsbyid error " + error)
    }   
}

/***************************************************
 * Get all inventory item details 
 ****************************************************/
async function getInventoryByInv_id(inv_id) {
   try{
     const data = await pool.query(
        `SELECT * FROM public.inventory
        WHERE inv_id = $1`,
        [inv_id]
     )
     return data.rows
    } catch(error){
        console.error("getinventoryid error " + error)
    }   
}

/* *****************************
* Add New Classification
* *************************** */
async function newClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Add New Vehicle
* *************************** */
async function newInventoryItem(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventoryItems(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [ inv_id ])
    return data
  } catch (error) {
    console.error("Delete Inventory Error", error)
  }
}

/* *****************************
* Add New Review
* *************************** */
async function newReview(review_text, inv_id, account_id){
  try {
    const sql = "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/***************************************************
 * Get all review details 
 ****************************************************/
async function getReviewsByInvId(inv_id) {
  try{
    const data = await pool.query(
      `SELECT r.review_id,
        r.review_text,
        r.review_date,
        a.account_firstname,
        a.account_lastname 
      FROM public.review AS r
      JOIN public.account AS a
      ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC`,
      [inv_id]
     )
     return data.rows
    } catch(error){
        console.error("getinventoryid error " + error)
    }   
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInv_id, newClassification, newInventoryItem, updateInventory, deleteInventoryItems, newReview, getReviewsByInvId};