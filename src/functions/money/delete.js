const { SimulationUserSchema } = require("../../../models/user");

async function deleteCurrency(currencyName){
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");
    try {
        const result = await SimulationUserSchema.updateMany(
            {},
            { $pull: { Currency: { name: currencyName } } }
        );
        if (result.nModified > 0) {
            return;
        } else {
            return `Currency not found.`
        }
    } catch (error) {
        console.error('Error deleting currency:', error);
    }
}

module.exports = deleteCurrency;