const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./database_connection')
const auth = require('./authenticate_company')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const app = express()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors())

app.post('/home', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        if (err){
            res.json(err)
        } else {
            console.log(decoded)
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
    const {username, password, company} = req.body
    db.createCompany(username, password, company)
        .then(resp => {
            resp
                ? res.json('success')
                : res.json(null)
        })
})

app.post('/properties', validateToken, (req, res) => {
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

app.delete('/employee', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        if (err){
            res.json(err) 
        } else {
            decoded.username && req.body.employee
                ? db.deleteEmployee(decoded.username, req.body.employee).then(res.json('Deleted'))
                : res.json('failed to delete')
        }
    })
})

app.post('/property', validateToken, (req, res) => {
    console.log(req.body.property)
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        if (err){
            console.log(err)
            res.json(err)
        } else {
            db.updateProperty(decoded.username, req.body.property)
                .then(resp => resp == 1)
                .then(truth => {
                    truth
                        ? res.json({ outcome: 'success' })
                        : res.json(null)
                })
                    // success 
                    
                    //     ? res.json('success')
                    //     : res.json(null)
                .catch((err) => res.json(err))
            }
        })
})

app.delete('/property', validateToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        if (err){
            res.json(err)
        } else {
            db.deleteProperty(decoded.username, req.body.property)
                .then(success => {
                    success
                        ? res.json({ property: req.body.property })
                        : res.json(null)
                })
        }
    })
})

app.post('/email', validateToken, (req, res) => {
    if (req.body.properties == []|| req.body.employees == false){
        res.json('failed')
        return
    }

    let {employees, properties} = req.body

    let emails = employees.map(employee => employee.email)
    emails.length == 1
        ? emails = emails[0]
        : emails = emails.join(', ')
    console.log(emails)
    
    let emailText = properties.map(property => {
        const {address, 
               tenant_name, 
               tenant_email, 
               tenant_phone, 
               latest_survey_date} = property
        return `
                Address: ${address},
                Tenant: ${tenant_name},
                Email: ${tenant_email},
                Phone: ${tenant_phone},
                Most Recent Survey: ${latest_survey_date}

        `
    })

    emailText = emailText.join(`
        =====================
    `)

    let mailOptions = {
        from: process.env.EMAIL,
        to: emails,
        subject: 'Surveys to Be Completed: Automated with Node.js',
        text: emailText
    }
    
    transporter.sendMail(mailOptions, (err, info) => {
        err
            ? res.json(err)
            : res.json('Email Sent: ' + info.response)
    })
})

function validateToken(req, res, next){
    //Get auth header value
    
    const bearerHeader = req.headers['authorization'];
    // console.log(bearerHeader)
    //Check if bearer exists 
    if (typeof bearerHeader == 'string'){
        //Split string after 'Bearer'
        const bearer = bearerHeader.split(' ')
        //Get token from array
        const bearerToken = bearer[1]
        //set token
        req.token = bearerToken
        //Next middleware
        next();
    } else {
        //Forbidden
        res.json('forbidden')
    }
}

app.post('/login', (req, res) => {
    const {username, password} = req.body
    auth.authenticateCompany(username, password)
        .then(bool => {
            return bool
                ? createToken(username, res)
                : res.json('Failed to Authenticate')
        })
})

app.post('/employees', validateToken, (req, res) => {
    const {name, email} = req.body
    jwt.verify(req.token, process.env.SECRET, (err, decoded) => {
        if (err) {
            res.json(err)
        } else {
            db.addEmployee(decoded.username, name, email)
                .then(() => res.json({name: name, email: email}))
                .catch(() => res.json('failed'))
        }
    })
})

function createToken(username, res){
    jwt.sign({ username }, process.env.SECRET, {expiresIn: 30 * 60}, (err, token) => {
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