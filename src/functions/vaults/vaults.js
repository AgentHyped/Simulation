const { SimulationUserSchema } = require("../../../models/user");

async function BuyVaults(UserId, Item, Cost, currencyName, Capacity) {
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if (!Item) throw new TypeError("A valid item was not given. SOLUTION: Provide a string to store in the database, this will be the item that goes into a users inventory");
    if (!Cost || isNaN(parseInt(Cost))) throw new TypeError("A valid price cost was not given. SOLUTION: Add a price that the item costs");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");
    if (Capacity && isNaN(parseInt(Capacity))) throw new TypeError("The capacity provided is not an integer. SOLUTION: Provide a valid integer for capacity");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });
    if (!data) return `No such user found in the database.`;

    const currency = data.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    const vault = data.Vaults.find(v => v.name === Item);

    if (currency.amount < parseInt(Cost)) {
      return `You do not have enough money.`;
    }

    if (vault) {
      return `You already own this vault.`;
    }

    const newVault = { name: Item, amount: '0' };
    if (Capacity) {
      newVault.capacity = Capacity;
    }

    data.Vaults.push(newVault);
    currency.amount -= parseInt(Cost);
   
    await SimulationUserSchema.findOneAndUpdate({ UserID: UserId }, data)

    return `Purchase successful.`;
}

module.exports = BuyVaults;