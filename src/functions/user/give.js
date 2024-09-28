const { SimulationUserSchema } = require("../../../models/user");

async function giveMoney(UserId, UserIdSec, Money, currencyName) {
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if (!UserIdSec) throw new TypeError("A valid secondary user ID was not given. SOLUTION: Provide a valid secondary user ID");
    if (!Money || isNaN(parseInt(Money))) throw new TypeError("A valid integer was not provided to send money. SOLUTION: Provide a valid integer");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");
  
    const sender = await SimulationUserSchema.findOne({ UserID: UserId });
    if (!sender) return `No such user found in the database.`
      
    const receiver = await SimulationUserSchema.findOne({ UserID: UserIdSec });
    if (!receiver) {
    const newReceiver = new SimulationUserSchema({
        UserID: UserIdSec,
        Currency: [{ name: currencyName, amount: Money }],
        Inventory: { type: Object },
        LastUpdated: new Date(),
        CooldownExpires: new Date()
    });
  
    await newReceiver.save();
    const currency = sender.Currency.find(c => c.name === currencyName);
    currency.amount -= parseInt(Money)
    sender.LastUpdated = new Date();
  
    await sender.save();
    return;
    }
    const currency = sender.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    const currencyReciever = receiver.Currency.find(c => c.name === currencyName);
    if (!currencyReciever) return `Currency not found.`;
  
    if (currency.amount < parseInt(Money)) {
    return `You have insufficient funds.`
    }
  
    currency.amount -= parseInt(Money);
    sender.LastUpdated = new Date();
    currencyReciever.amount += parseInt(Money);
    receiver.LastUpdated = new Date();
  
    await sender.save();
    await receiver.save();
}

module.exports = giveMoney;