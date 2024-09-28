const { SimulationUserSchema } = require("../../../models/user");

async function DepositIntoVault(UserId, Vault, Money, currencyName){
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if (!Money || isNaN(parseInt(Money))) throw new TypeError("A valid integer was not provided to send money. SOLUTION: Provide a valid integer");
    if (!Vault) throw new TypeError("A valid vault name was not specified. SOLUTION: Provide a valid vault name that the user owns");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const data = await SimulationUserSchema.findOne({ UserID: UserId })
    if (!data) return `No such user found in the database.`;

    const currency = data.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    const vault = data.Vaults.find(v => v.name === Vault);
    if(!vault) return `Vault not found.`
    

    if (currency.amount < parseInt(Money)) {
      return `You do not have enough money.`;
    } 

    if (vault.capacity && (vault.amount + Money) > vault.capacity) {
      return `Deposit exceeds vault capacity.`;
    }

    currency.amount -= parseInt(Money);
    vault.amount += parseInt(Money);

    await SimulationUserSchema.findOneAndUpdate({ UserID: UserId }, data)
}

module.exports = DepositIntoVault;