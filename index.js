const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const jwtSimple = require('jwt-simple')
const issue = require('./models/issue')

/// start app 
const port = 8080
app.listen(process.env.PORT || port, () => {
    console.log(`app running on ${port}`)
})

/// connect to mongodb
/// for this purpose mongose url type here, other put on env file
mongoose.connect('mongodb://localhost:27017/tablefilter', { useNewUrlParser: true })
mongoose.connection.on("open", function() {
    console.log("Connected to mongo server.")
})

/// enabling cross origin 
app.use(cors())
app.use(express.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(express.json());

app.post('/api/issue', async (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            success: false
        })
    }

    issue.create(
        req.body
    ).then(newIssue => {
        res.status(200).send({
            success: true,
            message: "success to create issue",
            data: newIssue
        })
    }).catch(error => {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        })
    })
})

app.get('/api/issue', async (req, res) => {

    if (!req.body) {
        return res.status(400).send({
            success: false
        })
    }

    const { priority, label } = req.query
    const argQuery = adminType == 1 ? { companyId: accountId } : { vendorId: accountId }
    console.log(adminType, accountId)
    console.log(argQuery)

    eventCol.find({
        $or: [
            {
              priority: priority
            },
            {
              label: { $elemMatch : { label } }
            }
        ]
    })
    .then((foundEvent) => {
        console.log(foundEvent)
        if(err) {
            res.status(500).send({
                message: "Database Error",
            })
        }

        if(foundEvent[0]){
            res.status(200).send({
                message: "success find event",
                data: foundEvent
            })
        } else {
            res.status(200).send({
                message: "no event has been created",
                error: true
            })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).send({
            message: "Internal Server Error",
        })
    })
})