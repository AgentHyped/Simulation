const { SimulationUserSchema } = require("../../../models/user");

async function GetUser(UserId){
    if(!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });
    if (!data) return `No such user found in the database.`

    return data
}

module.exports = GetUser;