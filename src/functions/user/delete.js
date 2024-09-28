const { SimulationUserSchema } = require("../../../models/user");

async function deleteUser(UserId) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");

    const validUser = await SimulationUserSchema.findOne({ UserID: UserId });

    if(validUser) {
      SimulationUserSchema.findOneAndDelete({ UserID: UserId }).catch(e => console.log(`Failed to delete user: ${e}`));
    } else {
      return `No such user found in the database.`
    }
}

module.exports = deleteUser;