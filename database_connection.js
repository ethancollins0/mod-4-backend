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
}

function addNewProperty(property, username){
    const {address, 
           tenant_email, 
           tenant_phone, 
           tenant_name, 
           latest_survey_date} = property

    return getCompanyId(username)
        .then(company => company[0].id)
        .then(id => {
            return db('properties').insert(
                {address,
                 latest_survey_date, 
                 company_id: id, 
                 tenant_name, 
                 tenant_email, 
                 tenant_phone}).returning('id')

        })
}


module.exports = {
    getEmployees,
    getProperties,
    addNewProperty
}

// getProperties('username').then(console.log)