const { SimulationUserSchema } = require("../../../models/user");

async function inventory(UserId, returnMapped){
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });

    if(!data) return `No such user found in the database.`
    if(!data.Inventory) return `You do not own anything.`

    if(returnMapped === true) {
      const mappedData = Object.keys(data.Inventory).map((key) => {
        return `${key} (${data.Inventory [key]})`;
      })
      .join("\n");

      return `${mappedData}`
    } else {
      return data.Inventory
    }
}

module.exports = inventory;