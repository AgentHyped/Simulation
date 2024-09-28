const { SimulationUserSchema } = require("../../../models/user");

async function GetAll() {
    const data = await SimulationUserSchema.find();
    if (!data) return `The database is empty.`

    return data
}

module.exports = GetAll;