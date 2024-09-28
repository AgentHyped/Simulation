const { SimulationUserSchema } = require("../../../models/user");

async function getAllAchievements(UserId){
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");

    try {
      const user = await SimulationUserSchema.findOne({ UserID: UserId });
      if (!user) return `No such user found in the database.`;

      const achievementInfo = user.Achievements.map(element => {
        return {
          name: element.name,
          description: element.description,
          difficulty: element.difficulty || 'No difficulty'
        };
      });

      if(!achievementInfo) return `You do not have any achievements.`

      return achievementInfo
    } catch(err) {
      console.error(`Error trying to get users achievements: ${err}`)
    }
}

module.exports = getAllAchievements;