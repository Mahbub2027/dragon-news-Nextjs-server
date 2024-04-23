const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l5wiuzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();


    const categoriesCollection = client.db("dragon_news").collection("categories");
    const newsCollection = client.db("dragon_news").collection("news");

    // news api
    app.get("/all-news", async (req, res)=>{
        const result = await newsCollection.find().toArray();
        res.send({ status: true, message: "success", data: result});
    })
    // specifics news api
    app.get("/news/:id", async(req, res)=> {
        const id = req.params.id;
        const news = {_id : new ObjectId(id)};
        const result = await newsCollection.findOne(news);
        res.send({ status: true, message: "success", data: result});
    })

    // categories
    app.get("/categories", async (req, res)=>{
        const categories = await categoriesCollection.find({}).toArray();
        res.send({ status: true, message: "success", data: categories});
    })
    // specifics categories api
    app.get("/news", async(req,res)=>{
        const name = req.query.category;
        let newses = []; 
        if(name == "all-news"){
            newses = await newsCollection.find({}).toArray();
            return res.send({status: true, message: "success", data: newses})
        }
        newses = await newsCollection.find({category: { $regex: name, $options: "i"}})
        .toArray();
        return res.send({status: true, message: "success", data: newses})
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);



app.get("/", (req, res)=>{
    res.send("Welcome to dragon news...")
})

app.listen(port, ()=>{
    console.log(`Dragon News server running on port ${port}`);
})
