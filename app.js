const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/task';
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

class MongoDBCache {
    constructor(collectionName) {
      this.collectionName = collectionName;
    }
  
    async get(key) {
      const db = client.db();
      const collection = db.collection(this.collectionName);
  
      const cacheEntry = await collection.findOne({ _id: key });
  
      if (cacheEntry) {
        return cacheEntry.data;
      }
  
      return null;
    }
  
    async set(key, data) {
      const db = client.db(); 
      const collection = db.collection(this.collectionName);
  
      await collection.updateOne({ _id: key }, { $set: { data } }, { upsert: true });
    }
  }
  
  const cache = new MongoDBCache('cache_collection');
  cache.set('myKey', 'myCachedData');
  const cachedData = cache.get('myKey');
  console.log('Cached Data:', cachedData);
  