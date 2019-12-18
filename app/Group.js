export default class Group {
    constructor(db) {
        this._db = db;
    }

    getAll() {
        return this._db.getGroups();
    }

    get(id) {
        return this._db.getGroupById(id);
    }
}
