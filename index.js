const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// middleware..
const corsOptions = {
  origin: [
    "https://assigenment-11-server-pearl.vercel.app",
    "https://assignment-11-d1ae5.web.app",
    "https://assignment-11-d1ae5.firebaseapp.com",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

    // jwt token...
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log(user);
      const token = await jwt.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: "2d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // Logout jwt..
    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 0,
        })
        .send({ success: true });
    });

    // Blog Add and get..
    app.post("/addBlog", async (req, res) => {
      const blog = req.body;
      console.log(blog);
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    // Blog..
    app.get("/addBlog", async (req, res) => {
      const filter = req.query.filter;
      // let titleName = {}
      const title = req.query.title;
      console.log(filter);
      let query = {}
      if(title) query.title= {'$regex' : title, '$options' : 'i'}
      if(filter) query.category = filter
      console.log(query);
      const result = await blogCollection.find(query).toArray();
      res.send(result);
    });


    // Blog Details...
    app.get("/addBlogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });

    // Blogs updated...
    app.patch("/addBlogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      console.log(filter);
      const updateData = req.body;
      console.log(updateData);
      const updateUserData = {
        $set: {
          title: updateData.title,
          category: updateData.category,
          longDescription: updateData.longDescription,
          shortDescription: updateData.shortDescription,
          photoURL: updateData.photoURL,
        },
      };
      const result = await blogCollection.updateOne(filter, updateUserData);
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
        query = { email: req.query.userMail };
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

    // Comment Collection..
    app.post("/comment", async (req, res) => {
      const body = req.body;
      const result = await commentsCollection.insertOne(body);
      res.send(result);
    });

    app.get("/comment", async (req, res) => {
      const result = await commentsCollection.find().toArray();
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
