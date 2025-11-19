const { Pool } = require("pg") // Imports the "Pool" functionality from the "pg" package. A pool is a collection of connection objects that allow multiple site visitors to be interaction with the database at any time. This keeps from having to create separate connections for each interaction.
require("dotenv").config() //Imports the "dotenv" package which allows the sensitive information about database location and connection to be stored in a separate location and still be accessed
/**********************************************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * ********************************************/

let pool //creates a local pool variable to hold the functionality of the "Pool" connection
if (process.env.NODE_ENV == "development"){ //an "if" test to see if the code exists in a development environment as declared in .env file. When in production environment, no value will be found
    pool = new Pool({ //creates a new pool instance from imported Pool class
        connectionString : process.env.DATABASE_URL, //indictaes how pool will connect t the database
        ssl: {
            rejectUnauthorized: false, //describes how SSLis used in connection to the database
        },
    })

    // Added for troubleshooting queries
    //during development
    module.exports = {                                     //Exports an asynchronous query function that 
        async query(text, params){                         //accepts the text of the query and any pameters.
            try{                                           //
                const res = await pool.query(text, params) //
                console.log("executed query", { text })    //When the query runs it will add the SQL to the console.log
                return res                                 //
            } catch (error) {                              //If query fails,
                console.error("error in query", {text})    //it will console log SQL text to the console as error
                throw error
            } //This code is primarily for troubleshooting as you develop
        },
    }
}else{
    pool = new Pool({ //creates new Pool instance from pool class
      connectionString : process.env.DATABASE_URL,  
    })
    module.exports = pool //exports the pool object to be used whenever a database connection is needed(this is for production environment)
}