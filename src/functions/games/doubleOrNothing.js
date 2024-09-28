const { SimulationUserSchema } = require("../../../models/user");

async function doubleOrNothing(UserId, Money, currencyName) {
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if (!Money || isNaN(parseInt(Money))) throw new TypeError("A valid integer was not provided to send money. SOLUTION: Provide a valid integer");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const gambler = await SimulationUserSchema.findOne({ UserID: UserId });
    if (!gambler) return `No such user found in the database.`
    const amountToBet = parseInt(Money)

    if(gambler.Money < amountToBet) return `You cannot make this bet, you have insufficient funds.`

    function random() {
      const num = Math.floor(Math.random() * 2);
      return num === 1;
    };

    const currency = gambler.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    if(random() === true ) {
      currency.amount += parseInt(amountToBet)
      await gambler.save();
      return `You win.`
    } else {
        currency.amount -= parseInt(amountToBet)
        await gambler.save();
        return `You lost.`
    }
}

module.exports = doubleOrNothing;