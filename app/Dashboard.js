export default class Dashboard {
  constructor(db) {
    this._db = db;
  }

  async get(email) {
    return await this._db.getDashboard().then(groups => {
      let deshboard = {
        userGroup: {},
        prevGroup: {},
        nextGroup: {}
      };

      let participants;
      for (let index = 0; index < groups.length; index++) {
        participants = (groups[index].participants) ? groups[index].participants : [];
        for(let participantsIndex = 0; participantsIndex < participants.length; participantsIndex++) {
          if(participants[participantsIndex].email
              && participants[participantsIndex].email === email) {
            deshboard.userGroup.name = groups[index].name;
            deshboard.userGroup.totalSteps = groups[index].totalSteps;

            if(index !== 0) {
              const prevGroup = groups[index-1];
              deshboard.prevGroup.name = prevGroup.name;
              deshboard.prevGroup.totalSteps = prevGroup.totalSteps;
            }

            if(index !== groups.length - 1) {
              const nextGroup = groups[index+1];
              deshboard.nextGroup.name = nextGroup.name;
              deshboard.nextGroup.totalSteps = nextGroup.totalSteps;
            }
          }
        }
      }
      return deshboard;
    });
  }
}
