const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// middleware..
// const corsOptions = {
//   origin: ['http://localhost:5173', 'http://localhost:5174','***'],
//   credentials: true,
//   optionSuccessStatus: 200,
// }

app.use(cors())
app.use(express.json());


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfp7rpr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //MongoDB database..
    const database = client.db("AllBlog");
    const blogCollection = database.collection("blog");

    

    // Blog Add and get..
    app.post('/addBlog', async(req, res)=>{
        const blog = req.body;
        console.log(blog);
        const result = await blogCollection.insertOne(blog);
        res.send(result)
    })

    app.get('/addBlog', async(req,res)=>{
        const cursor = blogCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })




    // 
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Blogging Website server is running..')
  })
  
  app.listen(port, () => {
    console.log(`Blogging Website server is running: ${port}`)
  })