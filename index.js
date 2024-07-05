const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxt94sc.mongodb.net/?appName=Cluster0`;

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
    const spotCollection = client.db("spotDB").collection("spot")
    // post spot
    app.post('/spot', async (req, res) => {
      const newSpot = req.body
      const result = await spotCollection.insertOne(newSpot)
      res.send(result)
    })

    // get item
    app.get('/spot', async (req, res) => {
      const cursor = spotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // get item using id
    app.get('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.findOne(query)
      res.send(result)
    })

    // get item using email
    app.get('/myList/:email', async (req, res) => {
      const result = await spotCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    app.delete('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedSpot = req.body;

      const spot = {
        $set: {
          name: updatedSpot.name,
          country: updatedSpot.country,
          location: updatedSpot.location,
          photo: updatedSpot.photo,
          cost: updatedSpot.cost,
          Ttime: updatedSpot.Ttime,
          visitor: updatedSpot.visitor,
          discription: updatedSpot.discription,
          season: updatedSpot.season
        }
      }
      const result= await spotCollection.updateOne(filter,spot,options)
      res.send(result)
    })
    // Send a ping to confirm a successful connection

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('my-tenth-assignment server is running')
})

app.listen(port, () => {
  console.log(`my server is running on: ${port}`)
})