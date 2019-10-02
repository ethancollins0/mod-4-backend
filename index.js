const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const db = require('./database_connection')
const auth = require('./authenticate_company')
const jwt = require('jsonwebtoken')

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});
app.use(cors())


app.post('/home', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        if (err){
            res.json(err)
        } else {
            const username = decoded.username
            const company_data = {}
            const get_data = db.getEmployees(username)
                .then(employees => company_data['employees'] = employees)
                .then(() => db.getProperties(username))
                .then(properties => {
                    company_data['properties'] = properties
                    return company_data
                })
            get_data.then(data => res.json(data))
        }
    })
})

app.post('/signup', (req, res) => {
    const {username, password, company} = req.body.user
    db.createCompany(username, password, company)
    // console.log(username, password, company)
    res.json('temp')
})

app.post('/properties', validateToken, (req, res) => {
    console.log('test', req.body)
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        if (err){
            res.json(err)
        } else {
        // console.log(decoded, decoded.username, req.body.property)
        decoded.username && req.body.property
            ? db.addNewProperty(req.body.property, decoded.username).then(res.json(req.body.property))
            : res.json('Failed to add property')
        }
    })
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    auth.authenticateCompany(username, password)
        .then(bool => {
            return bool
                ? createToken(username, res)
                : res.json('Failed to Authenticate')
        })
})

app.post('/signup', validateToken, (req, res) => {

})

function createToken(username, res){
    jwt.sign({ username }, process.env.SECRET, {expiresIn: 30 * 60} ,(err, token) => {
        getCompanyData(username).then(data => res.json([data, token]))
    })
}

function getCompanyData(username){
    const company_data = {}
    const get_data = db.getEmployees(username)
        .then(employees => company_data['employees'] = employees)
        .then(() => db.getProperties(username))
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

function validateToken(req, res, next) {
    if (req.token){
        const bearer = req.token
        const bearerHeader = bearer.split(' ')[0]
        req.token = bearerHeader
        next()
    } else {
        res.json('forbidden')
    }
}