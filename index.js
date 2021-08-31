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
app.use(cors({
    origin: '*'
}))
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

    let { priority, label, pageNumber, pageSize } = req.query

    // make it to integer data type
    pageNumber = parseInt(pageNumber)
    pageSize = parseInt(pageSize)

    // get total data available
    let pageCount =  await issue.find({
        $or : [
            {priority: { $in : priority.split(",")}},
            {label: { $in: label.split(",")}}
        ]
    }).count()

    issue.find({
        $or : [
            {priority: { $in : priority.split(",")}},
            {label: { $in: label.split(",")}}
        ]
    })
    .skip(pageSize * (pageNumber))
    .limit(pageSize)
    .sort({
        _id: 1
    })
    .lean(true)
    .then((foundIssues) => {
        console.log(foundIssues)

        if(foundIssues[0]){
            res.status(200).send({
                success: true,
                data: foundIssues,
                pages: parseInt(pageCount)
            })
        } else {
            res.status(200).send({
                success: false,
                message: "no issue found",
                data: []
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