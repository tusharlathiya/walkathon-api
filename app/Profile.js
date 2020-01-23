export default class Profile {
    constructor(db) {
        this._db = db;
    }

    async get(email) {
         const group = await this._db.getGroupByEmail(email);
         const profile = group.participants.filter(participant => participant.email === email);
         return profile.length > 0 ? profile[0] : {};
    }
}
