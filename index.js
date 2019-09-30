const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./database_connection')

const app = express()
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors())

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
        ? db.addNewProperty(req.body.property, req.body.username).then(id => res.json(`Added new property with id: ${id}`))
        : res.json('Failed to add property')
})

app.put('/', (req, res) => {
    res.json('PUT')
})




const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

