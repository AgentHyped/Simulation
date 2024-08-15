const mongoose = require("mongoose");
const { SimulationUserSchema } = require("./models/user");
require('./checkVersion')
var mongooseUrl;

class Simulation {

  /**
  * @param {string} [mongoDBUrl] - A valid mongo database URL.
  * @param {string} [UserId] - Discord user id.
  * @param {string} [UserIdSec] - Discord secondary user id.
  * @param {number} [Money] - Amount of money in account.
  * @param {number} [IncomeThreshold] - Amount of money in account.'
  * @param {string} [Item] - The item that gets stored into a users inventory in the database.
  * @param {string} [currencyName] - Name of the custom currency implemented into the db.
  * @param {number} [currencyAmount] - Amount of the custom currency implemented into the db to set when modifying currency.
  * @param {number} [Cost] - The cost of an item up for purchase when using the Simulation.purchase method.
  * @param {string} [Vault] - Name of a vault that matches the name of a vault in the db.
  * @param {Number} [Capacity] - The maximum amount that can be stored in a vault.
  * @param {String} [achievementName] - Name of an achievement.
  * @param {String} [achievementDescription] - Description of what the achievement is for.
  */

  static async mongoURL(mongoDBUrl) {
    if(!mongoDBUrl) throw new TypeError("A valid database url was not found. SOLUTION: Provide a MongoDB url");

    mongooseUrl = mongoDBUrl
    return mongoose.connect(mongoDBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  };

  static async balance(UserId, currencyName) {
    if(!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });
    if(!data) return 0;

    const currency = data.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    if(currency) {
      return currency.amount;
    } else {
      return 0;
    }
  }

  static async daily(UserId, IncomeThreshold, currencyName) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");
    if(!IncomeThreshold || isNaN(parseInt(IncomeThreshold))) throw new TypeError("Could not find an income threshold. SOLUTION: Provide an income threshold");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const validUser = await SimulationUserSchema.findOne({ UserID: UserId });
    const Earned = Math.floor(Math.random() * IncomeThreshold) + 1

    if(!validUser) {
      const newUser = new SimulationUserSchema({
          UserID: UserId,
          CooldownExpires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          Currency: [{ name: currencyName, amount: Earned }], 
          Inventory: { type: Object },
          Vaults: [],
          Achievements: [],
        });

        await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));
        return `${Earned}`
    }

    if (validUser.CooldownExpires && validUser.CooldownExpires > new Date()) {
      return `Daily cooldown has not expired yet.`
  }
        const currency = validUser.Currency.find(c => c.name === currencyName);
        if (!currency) return `Currency not found.`;
        currency.amount += Earned
        validUser.LastUpdated = new Date(); 
        validUser.CooldownExpires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        await validUser.save().catch(e => console.log(`Failed to affix money in the database: ${e}`));
        return `${Earned}`
  }

  static async affixMoney(UserId, Money, currencyName) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");
    if(!Money || isNaN(parseInt(Money))) throw new TypeError("The information provided was invalid or not present. SOLUTION: Provide a valid number to add more money");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database.");

    const validUser = await SimulationUserSchema.findOne({ UserID: UserId });

    if(!validUser) {
      const newUser = new SimulationUserSchema({
        UserID: UserId,
        LastUpdated: new Date(),
        Currency: [{ name: currencyName, amount: Money }],
        Inventory: { type: Object },
        Vaults: [],
        Achievements: [],
      });

      await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));

      return
    }

    const currency = validUser.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;
    currency.amount += parseInt(Money, 10);
    validUser.LastUpdated = new Date();

    await validUser.save().catch(e => console.log(`Failed to affix money in the database: ${e}`));
  }

  static async removeMoney(UserId, Money, currencyName) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");
    if(!Money || isNaN(parseInt(Money))) throw new TypeError("The information provided was invalid or not present. SOLUTION: Provide a valid number to add more money");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const validUser = await SimulationUserSchema.findOne({ UserID: UserId });

    if(!validUser) {
      const newUser = new SimulationUserSchema({
        UserID: UserId,
        LastUpdated: new Date(),
        Currency: [{ name: currencyName, amount: Money }],
        Inventory: { type: Object },
        Vaults: [],
        Achievements: [],
      });

      await newUser.save().catch(e => console.log(`Failed to log new user into the Database: ${e}`));

      return
    }

    const currency = validUser.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;
    currency.amount -= parseInt(Money)
    validUser.LastUpdated = new Date();

    await validUser.save().catch(e => console.log(`Failed to affix money in the database: ${e}`));
  }

  static async createUser(UserId, currencyName) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    try {
      const existingUser = await SimulationUserSchema.findOne({ UserID: UserId });

      if (existingUser) {
        return `User already exists.`
      } else {
        const newUser = new SimulationUserSchema({
          UserID: UserId,
          LastUpdated: new Date(),
          Currency: [{ name: currencyName, amount: 0 }],
          Inventory: { type: Object },
          Vaults: [],
          Achievements: [],
      });

      await newUser.save();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  static async deleteUser(UserId) {
    if(!UserId) throw new TypeError("Could not obtain user id. SOLUTION: Provide a valid and correct user id");

    const validUser = await SimulationUserSchema.findOne({ UserID: UserId });

    if(validUser) {
      SimulationUserSchema.findOneAndDelete({ UserID: UserId }).catch(e => console.log(`Failed to delete user: ${e}`));
    } else {
      return `No such user found in the database.`
    }
  }

  static async leaderboard(currencyName, topN = 10) {
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

  static async giveMoney(UserId, UserIdSec, Money, currencyName) {
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

  static async doubleOrNothing(UserId, Money, currencyName) {
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

  static async inventory(UserId, returnMapped){
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });

    if(!data) return `No such user found in the database.`
    if(!data.Inventory) return `You do not own anything.`

    if(returnMapped === true) {
      const mappedData = Object.keys(data.Inventory).map((key) => {
        return `${key} (${data.Inventory [key]})`;
      })
      .join("\n");

      return `${mappedData}`
    } else {
      return data.Inventory
    }
  }

  static async purchase(UserId, Item, Cost, currencyName){
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

  static get gather() {
    return {
      user: this.#GetUser.bind(this),
      all: this.#GetAll.bind(this)
    };
  }

  static async #GetAll() {
    const data = await SimulationUserSchema.find();
    if (!data) return `The database is empty.`

    return data
  }

  static async #GetUser(UserId){
    if(!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });
    if (!data) return `No such user found in the database.`

    return data
  }

  static get vaults() {
    return {
      buy: this.#BuyVaults.bind(this),
      deposit: this.#DepositIntoVault.bind(this),
      withdraw: this.#WithdrawFromVault.bind(this),
      owned: this.#OwnedVaults.bind(this),
    };
  }

  static async #OwnedVaults(UserId) {
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });

    if(!data) return `No such user found in the database.`
    if(!data.Vaults) return `You don't have any vaults.`

    const vaultsInfo = data.Vaults.map(vault => {
      return {
        name: vault.name,
        amount: vault.amount,
        capacity: vault.capacity || 'No capacity limit'
      };
    });

    return vaultsInfo
  }

  static async #BuyVaults(UserId, Item, Cost, currencyName, Capacity) {
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if (!Item) throw new TypeError("A valid item was not given. SOLUTION: Provide a string to store in the database, this will be the item that goes into a users inventory");
    if (!Cost || isNaN(parseInt(Cost))) throw new TypeError("A valid price cost was not given. SOLUTION: Add a price that the item costs");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");
    if (Capacity && isNaN(parseInt(Capacity))) throw new TypeError("The capacity provided is not an integer. SOLUTION: Provide a valid integer for capacity");

    const data = await SimulationUserSchema.findOne({ UserID: UserId });
    if (!data) return `No such user found in the database.`;

    const currency = data.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    const vault = data.Vaults.find(v => v.name === Item);

    if (currency.amount < parseInt(Cost)) {
      return `You do not have enough money.`;
    }

    if (vault) {
      return `You already own this vault.`;
    }

    const newVault = { name: Item, amount: '0' };
    if (Capacity) {
      newVault.capacity = Capacity;
    }

    data.Vaults.push(newVault);
    currency.amount -= parseInt(Cost);
   
    await SimulationUserSchema.findOneAndUpdate({ UserID: UserId }, data)

    return `Purchase successful.`;
  }

  static async #DepositIntoVault(UserId, Vault, Money, currencyName){
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

  static async #WithdrawFromVault(UserId, Vault, Money, currencyName){
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if (!Money || isNaN(parseInt(Money))) throw new TypeError("A valid integer was not provided to send money. SOLUTION: Provide a valid integer");
    if (!Vault) throw new TypeError("A valid vault name was not specified. SOLUTION: Provide a valid vault name that the user owns");
    if(!currencyName) throw new TypeError("A valid currency name was not given.. SOLUTION: Provide a valid currency name that matches the name in your database. If you have not set a custom currency then by default the name would be 'Money'");

    const data = await SimulationUserSchema.findOne({ UserID: UserId })
    if (!data) return `No such user found in the database.`;

    const vault = data.Vaults.find(v => v.name === Vault);

    if(!vault) {
      return `Vault not found.`
    }

    if (vault.amount < parseInt(Money) ) {
      return `You don't have that much in your vault.`;
    }

    const currency = data.Currency.find(c => c.name === currencyName);
    if (!currency) return `Currency not found.`;

    currency.amount += parseInt(Money);
    vault.amount -= parseInt(Money);

    await SimulationUserSchema.findOneAndUpdate({ UserID: UserId }, data)
  }

  static get currency() {
    return {
      create: this.#createCurrency.bind(this),
      delete: this.#deleteCurrency.bind(this),
    };
  }

  static async #createCurrency(currencyName, currencyAmount){
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

  static async #deleteCurrency(currencyName){
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

  static get achievements() {
    return {
      create: this.#createAchievements.bind(this),
      getAll: this.#getAllAchievements.bind(this),
    };
  }

  static async #createAchievements(UserId, achievementName, achievementDescription, difficulty){
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");
    if (!achievementName) throw new TypeError("A valid name for your achievement was not given. SOLUTION: Provide a name for your achievement");
    if (!achievementDescription) throw new TypeError("A valid description was not provided. SOLUTION: Provide a description of what your achievement is for");

    try {
      const user = await SimulationUserSchema.findOne({ UserID: UserId });
      if (!user) return `No such user found in the database.`;

      user.Achievements.push({
        name: achievementName,
        description: achievementDescription,
        difficulty: difficulty,
      });
      await user.save();
    } catch(err) {
      console.error(`Error trying to add users achievement: ${err}`)
    }
  }

  static async #getAllAchievements(UserId){
    if (!UserId) throw new TypeError("A valid user ID was not given. SOLUTION: Provide a valid user ID");

    try {
      const user = await SimulationUserSchema.findOne({ UserID: UserId });
      if (!user) return `No such user found in the database.`;

      const achievementInfo = user.Achievements.map(element => {
        return {
          name: element.name,
          description: element.description,
          difficulty: element.difficulty || 'No difficulty'
        };
      });

      if(!achievementInfo) return `You do not have any achievements.`

      return achievementInfo
    } catch(err) {
      console.error(`Error trying to get users achievements: ${err}`)
    }
  }
}

module.exports = Simulation;