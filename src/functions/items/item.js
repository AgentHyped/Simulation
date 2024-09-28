const { SimulationUserSchema } = require("../../../models/user");

async function purchase(UserId, Item, Cost, currencyName){
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if (!Item) throw new TypeError("A valid item was not given. SOLUTION: Provide a string to store in the database, this will be the item that goes into a users inventory");
    if (!Cost || isNaN(parseInt(Cost))) throw new TypeError("A valid price cost was not given. SOLUTION: Add a price that the item costs");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const params = {
      UserID: UserId
    }

    const data = await SimulationUserSchema.findOne({ UserID: UserId });
    if (!data) return `No such user found in the database.`

    const currency = data.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    if(currency.amount < parseInt(Cost)){
      return `You do not have enough money.`
    }

    await SimulationUserSchema.findOne(params, async(err, data) => {
      if(data){
          const hasItem = Object.keys(data.Inventory).includes(Item);
          if(!hasItem){
              data.Inventory[Item] = 1;
              currency.amount -= parseInt(Cost);
          } else {
              data.Inventory[Item]++;
              currency.amount -= parseInt(Cost);
          }
          await SimulationUserSchema.findOneAndUpdate(params, data)
      } else {
        return `Purchase failed. User is not in the database.`
      }
    }).clone()
}

module.exports = purchase;