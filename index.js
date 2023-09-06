const mongoose = require("mongoose");
const profile = require("./models/user");
var mongooseUrl;

class Simulation {

  /**
  * @param {string} [mongoDBUrl] - A valid mongo database URL.
  */

  static async mongoURL(mongoDBUrl) {
    if (!mongoDBUrl) throw new TypeError("A valid database url was not found. SOLUTION: Provide a MongoDB url")
    mongooseUrl = mongoDBUrl
    return mongoose.connect(mongoDBUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });
  }

  /**
  * @param {string} [UserId] - Discord user id.
  */

  static async balance(UserId) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id")

    const bal = new Promise(async ful => {
        const validUser = await profile.findOne({ UserId })
        if(!validUser) return ful(0)
        return ful(validUser.Money)
      })
  
      return bal
  }

  /**
  * @param {string} [UserId] - Discord user id.
  * @param {number} [Money] - Amount of money in account.
  */

  static async affixMoney(UserId, Money) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id")
    if (!Money || isNaN(parseInt(Money))) throw new TypeError("The information provided was invalid or not present. SOLUTION: Provide a valid number to add more money");

    const validUser = await profile.findOne({ UserID: UserId });

    if(!validUser) {
        const newUser = new profile({
            UserID: UserId,
            Money: Money,
          });

          await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));

          return (Math.floor(0.1 * Math.sqrt(Money)) > 0);
    }

    validUser.Money += parseInt(Money, 10);
    validUser.LastUpdated = new Date();

    await validUser.save().catch(e => console.log(`Failed to affix money in the database: ${e}`));

    return (Math.floor(0.1 * Math.sqrt(validUser.Money -= Money)));
  }

  static async daily(UserId) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id")

    const validUser = await profile.findOne({ UserId })

    if(!validUser) {
        const newUser = new profile({
            UserID: UserId,
            Money: Math.floor(Math.random() * 1000) + 1,
          });

          await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));
    }

    validUser.Money += Math.floor(Math.random() * 1000) + 1
    validUser.LastUpdated = new Date();

    await validUser.save().catch(e => console.log(`Failed to affix money in the database: ${e}`));
  }
}

module.exports = Simulation;