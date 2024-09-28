const { SimulationUserSchema } = require("../../../models/user");

async function createCurrency(currencyName, currencyAmount){
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");
    if(!currencyAmount|| isNaN(parseInt(currencyAmount))) throw new TypeError("A valid currency amount was not given.. SOLUTION: Provide a valid integer to set the amount of the currency the users should have.");
    try {
      const users = await SimulationUserSchema.find();
      for (const user of users) {
          const currency = user.Currency.find(c => c.name === currencyName);
          if (currency) {
              currency.amount += currencyAmount;
          } else {
              user.Currency.push({ name: currencyName, amount: currencyAmount });
          }
          await user.save();
      }
    } catch (error) {
      console.error('Error adding/updating currency for all users:', error);
    }
}

module.exports = createCurrency;