const { SimulationUserSchema } = require("../../../models/user");

async function convertCurrency(UserId, currencyToConvert, currencyReceived, currencyAmount, rate = 1) {
    if(!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if(!currencyToConvert) throw new TypeError("A valid currency name to convert was not given.. SOLUTION: Provide a valid currency name that matches the name in your database.");
    if(!currencyReceived) throw new TypeError("A valid currency name to receive through conversion was not given.. SOLUTION: Provide a valid currency name that matches the name in your database.");
    if(!currencyAmount|| isNaN(parseInt(currencyAmount))) throw new TypeError("A valid currency amount was not given.. SOLUTION: Provide a valid integer to set the amount of the currency the user should gain upon conversion.");
    if (!rate || isNaN(parseFloat(rate))) throw new TypeError("A valid rate was not given. SOLUTION: Provide a valid multiplier or divisor for the conversion.");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });
    if(!data) return `No such user found in the database.`

    const currencyConverted = data.Currency.find(c => c.name === currencyToConvert);
    if (!currencyConverted) return `Currency not found.`;

    const currencyToReceive = data.Currency.find(c => c.name === currencyReceived);
    if (!currencyToReceive) return `Currency not found.`;

    if (currencyConverted.amount < parseInt(currencyAmount)) {
        return `You have insufficient funds.`
    }
    
    const convertedAmount = parseInt(currencyAmount) / rate;

    currencyConverted.amount -= parseInt(currencyAmount);
    currencyToReceive.amount += convertedAmount;
    
    await data.save()
}

module.exports = convertCurrency;