export default class Dashboard {
  constructor(db) {
    this._db = db;
  }

  async get() {
    var x = false;
    var result = null;
    return await this._db.getDashboard().then(v => {
      result = v; x=true;
      console.log("l****"+v);
      return v;
    });
    console.log("completed***********");
    setInterval(() => {})
    return result;
  }

}