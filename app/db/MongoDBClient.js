import {MongoClient, ObjectID} from 'mongodb'
import {DB_NAME, DB_URL} from '../config/appConfig';

export default class MongoDBClient {
  constructor() {
    MongoClient.connect(DB_URL)
        .then(r => {
              this._db = r.db(DB_NAME);
              this._db.createCollection("groups");
            }
        )
  }

  getDashboard() {
      return this._db.collection("groups").aggregate([{
          $addFields : {
              totalSteps : { $sum : "$participants.steps"}
          }},{
            $sort : {totalSteps : 1}
          }
      ]).toArray();
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

   getGroupByEmail(email) {
      return this._db.collection("groups").findOne({'participants.email': email});
   }
}
