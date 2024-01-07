const mongoose = require("mongoose");
const profile = require("./models/user");
var mongooseUrl;

class Simulation {

  /**
  * @param {string} [mongoDBUrl] - A valid mongo database URL.
  * @param {string} [UserId] - Discord user id.
  * @param {string} [UserIdSec] - Discord secondary user id.
  * @param {number} [Money] - Amount of money in account.
  * @param {number} [IncomeThreshold] - Amount of money in account.
  */

  static async mongoURL(mongoDBUrl) {
    if(!mongoDBUrl) throw new TypeError("A valid database url was not found. SOLUTION: Provide a MongoDB url")

    mongooseUrl = mongoDBUrl
    return mongoose.connect(mongoDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  };

  static async balance(UserId) {
    if(!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID")

    const bal = new Promise(async ful => {
      const data = await profile.findOne({UserID: UserId});
      if(!data) return ful(0);
      ful(data.Money)
    })

    return bal
  }

  static async daily(UserId, IncomeThreshold) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");
    if(!IncomeThreshold) throw new TypeError("Could not find an income threshold. SOLUTION: Provide an income threshold");

    const validUser = await profile.findOne({UserID: UserId});
    const Earned = Math.floor(Math.random() * IncomeThreshold) + 1

    if(!validUser) {
        const newUser = new profile({
            UserID: UserId,
            Money: Earned,
            LastUpdated: new Date(),
            CooldownExpires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          });

          await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));

          return `${Earned}`
    }

    if (validUser.CooldownExpires && validUser.CooldownExpires > new Date()) {
      return `Daily cooldown has not expired yet.`
  }
        validUser.Money += Earned
        validUser.LastUpdated = new Date(); 
        validUser.CooldownExpires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        await validUser.save().catch(e => console.log(`Failed to affix money in the database: ${e}`));
        return `${Earned}`
  }

  static async affixMoney(UserId, Money) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id")
    if(!Money || isNaN(parseInt(Money))) throw new TypeError("The information provided was invalid or not present. SOLUTION: Provide a valid number to add more money");

    const validUser = await profile.findOne({UserID: UserId});

    if(!validUser) {
      const newUser = new profile({
        UserID: UserId,
        Money: Money,
        LastUpdated: new Date(),
        CooldownExpires: new Date()
      });

      await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));

      return
    }

    validUser.Money += parseInt(Money, 10);
    validUser.LastUpdated = new Date();

    await validUser.save().catch(e => console.log(`Failed to affix money in the database: ${e}`));
  }

  static async removeMoney(UserId, Money) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id")
    if(!Money || isNaN(parseInt(Money))) throw new TypeError("The information provided was invalid or not present. SOLUTION: Provide a valid number to add more money");

    const validUser = await profile.findOne({UserID: UserId});

    if(!validUser) {
      const newUser = new profile({
        UserID: UserId,
        Money: Money,
        LastUpdated: new Date(),
        CooldownExpires: new Date()
      });

      await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));

      return
    }

    validUser.Money -= parseInt(Money)
    validUser.LastUpdated = new Date();

    await validUser.save().catch(e => console.log(`Failed to affix money in the database: ${e}`));
  }

  static async createUser(UserId) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id")

    try {
      const existingUser = await profile.findOne({UserID: UserId});

      if (existingUser) {
        return;
      } else {
        const newUser = new profile({
          UserID: UserId,
          Money: 0,
          LastUpdated: new Date(),
          CooldownExpires: new Date()
      });

      await newUser.save();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  static async deleteUser(UserId) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id")

    const validUser = await profile.findOne({UserID: UserId});

    if(validUser) {
      profile.findOneAndDelete({UserID: UserId}).catch(e => console.log(`Failed to delete user: ${e}`));
    } else {
      return;
    }
  }

  static async leaderboard() {
    try {
      const topUsers = await profile.find().sort({ Money: -1 }).limit(10);

      if (topUsers.length > 0) {
          const leaderboard = topUsers.flatMap((user, index) => {
              return `#${index + 1}: <@${user.UserID}> \nMoney: ${user.Money}`;
          }).join('\n');

          return leaderboard;
      } else {
          return []; // Return an empty array when no users are found
      }

    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return null; // Return null to indicate an error occurred
    }
  }

  static async giveMoney(UserId, UserIdSec, Money) {
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID")
    if (!UserIdSec) throw new TypeError("A valid secondary user ID was not given. SOLUTION: Provide a valid secondary user ID")
    if (!Money || isNaN(parseInt(Money))) throw new TypeError("A valid integer was not provided to send money. SOLUTION: Provide a valid integer")
  
    try {
      const sender = await profile.findOne({UserID: UserId});
      if (!sender) return console.log('No sender found in the database!');
      
      const receiver = await profile.findOne({UserID: UserIdSec});
      if (!receiver) {
        const newReceiver = new profile({
          UserID: UserIdSec, // Assuming 'UserId' is the field name in your schema
          Money: parseInt(Money),
          LastUpdated: new Date()
        });
  
        await newReceiver.save();
        sender.Money -= parseInt(Money);
        sender.LastUpdated = new Date();
  
        await sender.save();
        return;
      }
  
      if (sender.Money < parseInt(Money)) {
        return;
      }
  
      sender.Money -= parseInt(Money);
      sender.LastUpdated = new Date();
      receiver.Money += parseInt(Money);
      receiver.LastUpdated = new Date();
  
      await sender.save();
      await receiver.save();
    } catch (error) {
      console.log(`Failed to complete the transaction: ${error}`);
    }
  }
}

module.exports = Simulation;
