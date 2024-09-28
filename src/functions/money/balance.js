const { SimulationUserSchema } = require("../../../models/user");

async function balance(UserId, currencyName) {
    if(!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });
    if(!data) return 0;

    const currency = data.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    return currency ? currency.amount : 0
}

module.exports = balance;