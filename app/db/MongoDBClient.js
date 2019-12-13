import {MongoClient} from 'mongodb'

export default class MongoDBClient {

  constructor() {
    MongoClient.connect("mongodb://localhost:27017")
        .then(r => {
              this._db = r.db("walkathon");
              this._db.createCollection("groups");
            }
        )
  }

  async getDashboard() {
    let toArray = await this._db.collection("groups").find({}).toArray();
    console.log(toArray);
    return toArray;
  }

}