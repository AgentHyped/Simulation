const { SimulationUserSchema } = require("../../../models/user");

async function createUser(UserId, currencyName) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    try {
      const existingUser = await SimulationUserSchema.findOne({ UserID: UserId });

      if (existingUser) {
        return `User already exists.`
      } else {
        const newUser = new SimulationUserSchema({
          UserID: UserId,
          LastUpdated: new Date(),
          Currency: [{ name: currencyName, amount: 0 }],
          Inventory: { type: Object },
          Vaults: [],
          Achievements: [],
      });

      await newUser.save();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
}

module.exports = createUser;