const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware..
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174", "***"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nfp7rpr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const wishListCollection = database.collection("wishList");
    const commentsCollection = database.collection("comment");

    // Blog Add and get..
    app.post("/addBlog", async (req, res) => {
      const blog = req.body;
      console.log(blog);
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    // Blog..
    app.get("/addBlog", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    });

    // Blog Details
    app.get("/addBlogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });

        // Comment Collection..
    app.post('/addBlogs', async(req,res)=>{
      const body = req.body;
      const result = await commentsCollection.insertOne(body);
      res.send(result)
    })

    app.get('/addBlogs',async(req,res)=>{
      const body = req.body;
      const result =await commentsCollection.findOne(body);
      res.send(result)
    })

    // Blogs updated...
    app.put("/addBlogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateData = req.body;
      console.log(updateData);
      const updateUserData = {
        $set: {
          title: updateData.title,
          category: updateData.category,
          LDesc: updateData.longDescription,
          SDesc: updateData.shortDescription,
          PhotoUrl: updateData.photoURL,
        },
      };
      const result = await blogCollection.updateOne(
        filter,
        updateUserData,
        option
      );
      res.send(result);
    });

    // WishList Collection..
    app.post("/wishList", async (req, res) => {
      const wishListBlog = req.body;
      const result = await wishListCollection.insertOne(wishListBlog);
      res.send(result);
    });

    app.get("/wishList", async (req, res) => {
      let query = {};
      if (req.query?.userMail) {
        query = { "users.userMail": req.query.userMail };
      }
      const result = await wishListCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/wishList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishListCollection.deleteOne(query);
      res.send(result);
    });



    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Blogging Website server is running..");
});

app.listen(port, () => {
  console.log(`Blogging Website server is running: ${port}`);
});
