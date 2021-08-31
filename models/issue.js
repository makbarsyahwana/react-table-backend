const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IssueSchema = new Schema({
    title: String,
    priority: String,
    issueLabel: [String]
})

module.exports = mongoose.model('Issue', IssueSchema)