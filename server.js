// Imports
const mysql = require('mysql2')
const inquirer = require('inquirer')
require('dotenv').config()

// MySQL Connection
const db =mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'workbase'
    }
)


