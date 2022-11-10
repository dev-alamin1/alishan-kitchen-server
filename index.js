const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
                const feedbackCollection = client.db('foodService').collection('feedbackCollection');


                //store foodService 
                app.post('/addFoodService',async(req,res)=>{
                    const foodServices = req.body;
                    foodServices.date = new Date();
                    
                    const result = await foodServiceCollection.insertOne(foodServices);
                    if(result.acknowledged)
                    {
                        res.send({insert:true})
                    }
                    
                });

                // find all food service

                app.get('/foodservices',async(req,res)=>{
                    const limitQuery = parseInt(req.query.limit);
                    const sort = {date:-1}
                    if(limitQuery)
                    {
                        const cursor = foodServiceCollection.find({}).sort(sort).limit(limitQuery);
                        const result = await cursor.toArray();
                        res.send(result)

                    }else{
                        const cursor = foodServiceCollection.find({}).sort(sort);
                        const result = await cursor.toArray();
                        res.send(result);
                        

                    }

                })

                // food service description by id

                app.get('/services/:id', async (req, res) => {
                        const id = req.params.id;
                        const query = { _id: ObjectId(id) };
                        const foodService = await foodServiceCollection.findOne(query);
                        res.send(foodService);
                });


                // store review/feedback

                app.post('/add/feedback',async(req,res)=>{
                     const userFeedback = req.body;

                     userFeedback.date = new Date();

                     const result = await feedbackCollection.insertOne(userFeedback);

                     if(result.acknowledged)
                     {
                         res.send({insert:true})
                     }
                })

                // feedback load by post id

                app.get('/feedback/:id',async(req,res)=>{
                     const id = req.params.id;
                     
                     const query = {
                        recipePostId:id
                     }

                     const sort = {
                        date:-1
                     }

                     const cursor = feedbackCollection.find(query).sort(sort);;
                     const allFeedback = await cursor.toArray();

                    res.send(allFeedback)
                    
                })


                // feedback load by feedback id , for edit 

                app.get('/edit/feedback/:id',async(req,res)=>{
                    const id = req.params.id;
                    
                    const query = {
                       _id:ObjectId(id)
                    }

                    const Feedback = await feedbackCollection.findOne(query);

                   res.send(Feedback)
                   console.log(Feedback);
                   
               })


               app.put('/update/feedback/:id',async(req,res)=>{
                const id = req.params.id;
                const feedback = req.body;
                
                const options = { upsert: true };

                const filter = {
                    _id: ObjectId(id)
                }

                const updateDoc = {
                  $set: {
                    feedback:feedback.feedback
                  },
                };
  

                const result = await feedbackCollection.updateOne(filter,updateDoc,options);
                res.send(result)
  
               
           })


             

                // feedback load by user uid

                app.get('/feedback/user/:id',async(req,res)=>{
                    const id = req.params.id;
                    const query = {
                      uid:id
                    }

                    const sort = {
                    date:-1
                    }

                    const cursor = feedbackCollection.find(query).sort(sort);;
                    const allFeedback = await cursor.toArray();

                   res.send(allFeedback)      
                })

                // delete user feedback 
                app.delete('/delete/:id',async(req,res)=>{
                    const id = req.params.id;
                    const query = {
                        _id: ObjectId(id)
                    }

                    const result = await feedbackCollection.deleteOne(query);
                    if(result.deletedCount>0)
                    {
                        res.send({
                            deleteSuccess:true
                        })
                    }
                });
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
