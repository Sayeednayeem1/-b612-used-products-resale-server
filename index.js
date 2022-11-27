const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
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

// todo verify jwt
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send('forbidden access');
        }
        req.decoded = decoded;
        next();
    })
};


async function run() {
    try {
        // todo get the services data collection
        const serviceCollection = client.db('buySellCollection').collection('services');

        // todo modal post orders collection
        const ordersCollection = client.db('buySellCollection').collection('orders');

        // todo usersCollection
        const usersCollection = client.db('buySellCollection').collection('users');

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

        // todo get orders data
        app.get('/orders', verifyJWT, async (req, res) => {
            const email = req.query.email;

            const decodedEmail = req.decoded.email;

            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'forbidden access' });
            }


            const query = { email: email };
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders);
        })

        // todo post related api is here
        app.post('/orders', async (req, res) => {
            const order = req.body
            console.log(order);
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        // TODO jwt token api
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '2 days' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' });
        })

        //todo get all the users data
        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        // todo get the data role of the user
        app.get('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            res.send({isAdmin: user?.role === 'admin'});
        })


        // todo get users list
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // todo update the user api
        app.put('/users/admin/:id', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await usersCollection.findOne(query);
            // todo if the user isn't admin he can't make changes 
            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' });
            }

            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });


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