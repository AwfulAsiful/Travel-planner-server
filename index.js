const express=require('express');
const { MongoClient } = require('mongodb')
require('dotenv').config()
const cors=require('cors');
const ObjectId=require('mongodb').ObjectId;
const app=express();
const port=process.env.PORT||5000;


//Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u4kot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
   try{
     await client.connect();
    //  console.log('Connected')
     const database=client.db('travelPlanner');
     const plansCollection=database.collection('plans');
     const ordersCollection=database.collection('orders')
     
     //GET All Plans
     app.get('/plans',async(req,res)=>{
         const cursor=plansCollection.find({});
         const plans=await cursor.toArray();
         res.send(plans);
     })
     //GET single plan
     app.get('/plans/:id',async(req,res)=>{
         const id=req.params.id;
         console.log(id)
         const query={_id:ObjectId(id)}
         const result= await plansCollection.findOne(query);
         res.send(result);
     })
     //POST API for Custom Plans
     app.post('/plans',async(req,res)=>{
         const result=await plansCollection.insertOne(req.body)
         res.json(result)
     })
 //POST API for orders
     app.post('/orders',async(req,res)=>{
         
       /*  res.send(req.body)
        console.log("Hitting the post") */
        //  console.log('Hitting the post',req.body);
         
         const result=await ordersCollection.insertOne(req.body);
         console.log(result);
         res.json(result);
     })
     app.get('/orders',async(req,res)=>{
         const cursor=ordersCollection.find({})
         const orders=await cursor.toArray()
         res.send(orders)
     })
     app.get('/orders/:email',async(req,res)=>{
        const email=req.params.email;
        console.log(email)
        const query={Email:ObjectId(email)}
        const result= await ordersCollection.findOne(query);
        res.json(result);
        console.log(result)
    })

      //UPDATE API
    app.put('/orders/:id',async(req,res)=>{
        const id=req.params.id;
        const update=req.body;
        const filter={_id:ObjectId(id)}
        const options={upsert:true}
        const updateDoc={
            $set:{
                Status:'Approved'
            }
        }
        const result=await ordersCollection.updateOne(filter,updateDoc,options)
        res.json(result);
    })
    
      // DELETE API
      app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await ordersCollection.deleteOne(query);
        res.json(result);
    }) 
    
    
   }
   finally{

   }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Running Server!!");
})
app.listen(port,()=>{
    console.log("Listening from port",port); 
})