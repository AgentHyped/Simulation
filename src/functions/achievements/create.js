const { SimulationUserSchema } = require("../../../models/user");

async function createAchievements(UserId, achievementName, achievementDescription, difficulty){
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if (!achievementName) throw new TypeError("A valid name for your achievement was not given. SOLUTION: Provide a name for your achievement");
    if (!achievementDescription) throw new TypeError("A valid description was not provided. SOLUTION: Provide a description of what your achievement is for");

    try {
      const user = await SimulationUserSchema.findOne({ UserID: UserId });
      if (!user) return `No such user found in the database.`;

      user.Achievements.push({
        name: achievementName,
        description: achievementDescription,
        difficulty: difficulty,
      });
      await user.save();
    } catch(err) {
      console.error(`Error trying to add users achievement: ${err}`)
    }
}

module.exports = createAchievements;