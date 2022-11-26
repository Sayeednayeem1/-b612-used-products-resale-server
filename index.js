const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// todo middleware
app.use(cors());
app.use(express.json());


// todo mongodb main

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qk4n58g.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // todo get the services data collection
        const serviceCollection = client.db('buySellCollection').collection('services');

        // todo modal post collection
        const ordersCollection = client.db('buySellCollection').collection('orders');

        // todo to get all the services data
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        //todo get specific service data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // todo post related api is here
        app.post('/orders', async(req, res) =>{
            const order = req.body
            console.log(order);
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        })

    }
    finally {

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