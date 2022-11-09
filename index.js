const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mttjtbw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run ()
{
        try
        {
            
                //create db, collection
                const foodServiceCollection = client.db('foodService').collection('foodServiceCollection');

                //store foodService 
                app.post('/addFoodService',async(req,res)=>{
                    const foodServices = req.body;
                    foodServices.date = new Date();
                    
                    const result = await foodServiceCollection.insertOne(foodServices);
                    console.log(result)
                    
                });

                // find all food 

                app.get('/foodservices',async(req,res)=>{
                    const limitQuery = parseInt(req.query.limit);
                    const sort = {date:-1}
                    if(limitQuery)
                    {
                        const cursor = foodServiceCollection.find({}).sort(sort).limit(limitQuery);
                        const result = await cursor.toArray();
                        console.log(result)
                        res.send(result)

                    }else{
                        const cursor = foodServiceCollection.find({}).sort(sort);
                        const result = await cursor.toArray();
                        res.send(result);
                        console.log(result)

                    }

                })
        }
        finally
        {

        }
}

run().catch(err =>console.log(err))


app.get('/',(req,res)=>{
    res.send("Server is running ...");
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});
