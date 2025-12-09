const pool = require("../database/") 

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const sql =  'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1'
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data by account ID
* ***************************** */
async function getAccountById (account_id) {
  try{
    const data = await pool.query(
      `SELECT * FROM public.account
      WHERE account_id = $1`,
      [account_id]
    )
    return data.rows[0]
    } catch(error){
      console.error("getaccountid error " + error)
    }   
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname  = $1, account_lastname  = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update Password Data
 * ************************** */
async function updatePassword(
    id, hashedPassword
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      hashedPassword, id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("updatePassword error: " + error)
  }
}

/* *****************************
* Return review data by account ID
* ***************************** */
async function getReviewsByAccId (account_id) {
try{
  const data = await pool.query(
    `SELECT r.review_id,
      r.review_text,
      r.review_date,
      r.inv_id,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      a.account_firstname,
      a.account_lastname
    FROM public.review AS r
    JOIN public.account AS a 
    ON r.account_id = a.account_id
    JOIN public.inventory AS i 
    ON r.inv_id = i.inv_id
    WHERE r.account_id = $1
    ORDER BY r.review_date DESC`,
    [account_id])
    return data.rows
    } catch(error){
      console.error("getaccountid error " + error)
    }   
}

async function getReviewsById(review_id) {
  try {
    const sql = `
      SELECT r.review_id,
             r.review_text,
             r.review_date,
             r.inv_id,
             i.inv_make,
             i.inv_model,
             i.inv_year
      FROM review r
      JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.review_id = $1
    `
    const data = await pool.query(sql, [review_id])
    return data.rows[0]
  } catch (error) {
    console.error("getReviewById error", error)
  }  
}

/* ***************************
 *  Update Review
 * ************************** */
async function updateReview(
  review_id,
  review_text
) {
  try {
    const sql =
      "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      review_text,
      review_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Review Data
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1"
    const data = await pool.query(sql, [ review_id ])
    return data
  } catch (error) {
    console.error("Delete Review Error", error)
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail,
  updateAccount, updatePassword, getAccountById, getReviewsByAccId,
  updateReview, deleteReview, getReviewsById
}