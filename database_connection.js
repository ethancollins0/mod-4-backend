require('dotenv').config()

const configuration = require('./knexfile')['development']
const db = require('knex')(configuration)

function getCompanyId(username){
    return db('companies').where('username', username)
}

function getPropertiesById(id){
    return db('properties').where('company_id', id)
}

function getProperties(username){
    return getCompanyId(username)
        .then(companies => {
            return companies.length > 0
                ? getPropertiesById(companies[0].id).then(properties => {
                    console.log(properties) 
                    return properties})
                : []
        })
}

function getEmployeesById(id){
    return db('employees').where('company_id', id)
}

function getEmployees(username){
    return getCompanyId(username)
        .then(companies => {
            return companies.length > 0
                ? getEmployeesById(companies[0].id).then(employees => employees)
                : []
        })
        // .then(company => getEmployeesById(company))
}
// function getEmployeesById(id){
//     db('employees').where('company_id', id)
// }

module.exports = {
    getEmployees,
    getProperties
}

getProperties('username').then(console.log)