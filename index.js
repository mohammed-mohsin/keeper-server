const express = require('express')

const bodyParser = require('body-parser')

const cors = require('cors')
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4trjz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json())
app.use(cors())
const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const noteCollection = client.db("keeperApp").collection("note");

    app.post('/addNote', (req, res) => {
        const note = req.body;
        noteCollection.insertOne(note)
            .then((result) => {
                console.log("Data added Successfully")
                console.log(result)
                // res.redirect('/')
            })


    })

    app.get('/notes', (req, res) => {
        noteCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        noteCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)


            })
    })




});




app.listen(port)