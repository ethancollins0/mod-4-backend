const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./database_connection')
const auth = require('./authenticate_company')
const bcrypt = require('bcrypt')
const session = require('client-sessions')
const app = express()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors())

app.use(session({
    cookieName: 'session',
    secret: process.env.SECRET,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}))




app.get('/home', (req, res) => {
    const company_data = {}
    const get_data = db.getEmployees('username')
        .then(employees => company_data['employees'] = employees)
        .then(() => db.getProperties('username'))
        .then(properties => {
            company_data['properties'] = properties
            return company_data
        })
        get_data.then(data => res.json(data))
})

app.post('/properties', (req, res) => {
    req.body.username && req.body.property
        ? db.addNewProperty(req.body.property, req.body.username).then(res.json(req.body.property))
        : res.json('Failed to add property')
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    auth.authenticateCompany(username, password)
        .then(bool => {
            return bool
                ? getCompanyData(username).then(data => res.json(data))
                : res.json('Failed to Authenticate')
        })
})

function getCompanyData(username){
    const company_data = {}
    const get_data = db.getEmployees('username')
        .then(employees => company_data['employees'] = employees)
        .then(() => db.getProperties('username'))
        .then(properties => {
            company_data['properties'] = properties
                return company_data
            })
    return get_data.then(data => data)
}

app.put('/', (req, res) => {
    res.json('PUT')
})

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

