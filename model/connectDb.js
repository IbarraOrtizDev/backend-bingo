const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const uri = process.env.DATABASE_URL;
const nameDB = process.env.DATABASE_NAME;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/*const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    let coll = await client.db(nameDB).collection("sesiones").find({}).toArray();
    console.log(coll[0]._id);

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
*/
class Db {
    constructor(){
        this.client = new MongoClient(uri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
          });
    }
    async connect(){
        try{
            await this.client.connect();
            console.log("Connected to MongoDB");
        }catch(e){
            console.error(e);
        }
    }
    async close(){
        try{
            await this.client.close();
            console.log("Disconnected to MongoDB");
        }catch(e){
            console.error(e);
        }
    }
    async insertOne(collection, data){
        try{
            let coll = await this.client.db(nameDB).collection(collection).insertOne(data);
            return coll;
        }catch(e){
            console.error(e);
        }
    }
    async insertMany(collection, data){
        try{
            let coll = await this.client.db(nameDB).collection(collection).insertMany(data);
            return coll;
        }catch(e){
            console.error(e);
        }
    }
    async find(collection, query){
        try{
            let coll = await this.client.db(nameDB).collection(collection).find(query).toArray();
            return coll;
        }catch(e){
            console.error(e);
        }
    }
    async findOne(collection, query){
        try{
            let coll = await this.client.db(nameDB).collection(collection).findOne(query);
            return coll;
        }catch(e){
            console.error(e);
        }
    }
    async updateOne(collection, query, data){
        try{
            let coll = await this.client.db(nameDB).collection(collection).updateOne(query, data);
            return coll;
        }catch(e){
            console.error(e);
        }
    }

}
module.exports = Db;