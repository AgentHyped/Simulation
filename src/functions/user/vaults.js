const { SimulationUserSchema } = require("../../../models/user");

async function OwnedVaults(UserId) {
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });

    if(!data) return `No such user found in the database.`
    if(!data.Vaults) return `You don't have any vaults.`

    const vaultsInfo = data.Vaults.map(vault => {
      return {
        name: vault.name,
        amount: vault.amount,
        capacity: vault.capacity || 'No capacity limit'
      };
    });

    return vaultsInfo
}

module.exports = OwnedVaults;