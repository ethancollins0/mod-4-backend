const bcrypt = require('bcrypt')
require('dotenv').config()

const configuration = require('./knexfile')['development']
const db = require('knex')(configuration)

function authenticateCompany(username, password){

    return db('companies').where('username', username)
        .then(company => {
            return company.length > 0
            ? db('companies').where('username', username)
                .then(company => company[0].password)
                .then(hash => bcrypt.compare(password, hash).then(result => result))
            : null
        })
}

function authenticateSession(){

}

module.exports = {
    authenticateCompany,
    authenticateSession,
}