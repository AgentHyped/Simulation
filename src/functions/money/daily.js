const { SimulationUserSchema } = require("../../../models/user");

async function daily(UserId, IncomeThreshold, currencyName) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");
    if(!IncomeThreshold || isNaN(parseInt(IncomeThreshold))) throw new TypeError("Could not find an income threshold. SOLUTION: Provide an income threshold");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const validUser = await SimulationUserSchema.findOne({ UserID: UserId });
    const Earned = Math.floor(Math.random() * IncomeThreshold) + 1

    if(!validUser) {
      const newUser = new SimulationUserSchema({
          UserID: UserId,
          CooldownExpires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          Currency: [{ name: currencyName, amount: Earned }], 
          Inventory: { type: Object },
          Vaults: [],
          Achievements: [],
        });

        await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));
        return `${Earned}`
    }

    if (validUser.CooldownExpires && validUser.CooldownExpires > new Date()) {
      return `Daily cooldown has not expired yet.`
    }

    const currency = validUser.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    currency.amount += Earned
    validUser.LastUpdated = new Date(); 
    validUser.CooldownExpires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    await validUser.save();
    return `${Earned}`
}

module.exports = daily;