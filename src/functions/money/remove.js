const { SimulationUserSchema } = require("../../../models/user");

async function remove(UserId, Money, currencyName) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");
    if(!Money || isNaN(parseInt(Money))) throw new TypeError("The information provided was invalid or not present. SOLUTION: Provide a valid number to add more money");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const validUser = await SimulationUserSchema.findOne({ UserID: UserId });

    if(!validUser) {
      const newUser = new SimulationUserSchema({
        UserID: UserId,
        LastUpdated: new Date(),
        Currency: [{ name: currencyName, amount: Money }],
        Inventory: { type: Object },
        Vaults: [],
        Achievements: [],
      });

      await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));

      return
    }

    const currency = validUser.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;
    currency.amount -= parseInt(Money)
    validUser.LastUpdated = new Date();

    await validUser.save().catch(e => console.log(`Failed to affix money in the database: ${e}`));
}

module.exports = remove;