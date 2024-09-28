const { SimulationUserSchema } = require("../../../models/user");

async function leaderboard(currencyName, topN = 10) {
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    try {
        const topUsers = await SimulationUserSchema.aggregate([
            { $unwind: "$Currency" },
            { $match: { "Currency.name": currencyName } },
            {
                $group: {
                    _id: "$UserID",
                    totalAmount: { $sum: "$Currency.amount" }
                }
            },
            { $sort: { totalAmount: -1 } },
            { $limit: topN }
        ]);

        if (topUsers.length > 0) {
            const leaderboard = topUsers.map((user, index) => {
                return `#${index + 1}: <@${user._id}> \n${currencyName}: ${user.totalAmount}`;
            }).join('\n');

            return leaderboard;
        } else {
            return 'No such user found in the database.';
        }

        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            return null;
    }
}

module.exports = leaderboard