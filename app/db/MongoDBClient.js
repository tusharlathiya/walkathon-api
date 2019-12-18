import {MongoClient, ObjectID} from 'mongodb'

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
    return toArray;
  }

  getGroups() {
      return this._db.collection("groups").aggregate([{
            $addFields : {
                totalSteps : { $sum : "$participants.steps"}
            }},{
                $project : {
                    participants : 0
                }
            },{
                $sort : {totalSteps : -1}
            }
        ]).toArray();
  }

  getGroupById(id) {
      return this._db.collection("groups").findOne({'_id': ObjectID(id)});
  }
}
