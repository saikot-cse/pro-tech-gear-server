const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jufxf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("proTechGear").collection("products");
    //create product api
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    //create blogs api
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogsCollection.find(query);
      const blogs = await cursor.toArray();
      res.send(blogs);
    });

    app.get('/product/:id',async (req,res)=>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const products = await productsCollection.findOne(query);
      res.send(products);
    });

    // add items
    app.post("/product", async(req,res)=>{
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    //delete item
    app.delete("/product/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })

    //update item
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const newItem = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: newItem.name,
          description: newItem.description,
          price: newItem.price,
          img: newItem.img,
          supplierName: newItem.supplierName,
          quantity: newItem.quantity,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Pro Tech Gear");
});

app.listen(port);
