const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// config 
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hjmc0vt.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://coffeeMaster:bVEpEiAVwg4xadXW@cluster0.hjmc0vt.mongodb.net/?retryWrites=true&w=majority";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    
    const coffeeCollection = client.db("coffeeDB").collection("coffee")
    const usersCollection = client.db("coffeeDB").collection("user")

    app.get('/coffee', async(req, res) => {
        const cursor = coffeeCollection.find()
        const result = await cursor.toArray()
        res.send(result)     
    })
      
    app.get('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }    
        const result = await coffeeCollection.findOne(query)
        res.send(result)
    })
      
    app.post('/coffee', async(req, res) => {
        const newCoffee = req.body;
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result)
    })
      
    app.put('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const coffee = req.body;
        
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true }
        const updateCoffee = {
            $set: {
                name: coffee.name,
                chef: coffee.chef,
                price: coffee.price,
                taste: coffee.taste,
                category: coffee.category,
                details: coffee.details,
                photo: coffee.photo
            }
        }

        const result = await coffeeCollection.updateOne(filter, updateCoffee, options)
        res.send(result)

    })
      
    app.delete('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)
    })

    // user related apis
    app.get('/user', async (req, res) => {
      const cursor = usersCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      // console.log("hitting backend");
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    app.patch('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email }
      const updateDoc = {
        $set: {
          lastLoginAt: user.lastLoginAt
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Coffee making server is running...")
})

app.listen(port, () => {
    console.log(`Coffee server is running port, ${port}`);
})