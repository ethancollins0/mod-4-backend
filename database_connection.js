require('dotenv').config()

const configuration = require('./knexfile')['development']
const db = require('knex')(configuration)