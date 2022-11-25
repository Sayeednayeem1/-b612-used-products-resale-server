const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 4000;
require('dotenv').config();

// todo middleware
app.use(cors());
app.use(express.json());


// todo mongodb main

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qk4n58g.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{

    }
    finally{

    }
}

run().catch(error => console.error(error));





// todo port

app.get('/', (req, res) => {
    res.send("This is a buy and sell server!");
});

// todo port running on,,,
app.listen(port, () => {
    console.log('server is running on port: ', port);
})