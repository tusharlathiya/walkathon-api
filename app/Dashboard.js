export default class Dashboard {
  constructor(db) {
    this._db = db;
  }

  async get() {
    return await this._db.getDashboard().then(v => {
      return v;
    });
  }
}
