[![versionBadge](https://img.shields.io/npm/v/agenthyped-simulation.svg?style=for-the-badge)](https://www.npmjs.com/package/agenthyped-simulation)
[![downloadsBadge](https://img.shields.io/npm/d18m/agenthyped-simulation.svg?style=for-the-badge)](https://www.npmjs.com/package/agenthyped-simulation)

# Introducing "Simulation" a NPM package for economy
#### DISCLAIMER! THIS PROJECT IS STILL IN DEVELOPMENT. USE AT YOUR OWN RISK

Welcome to Simulation, the global economy package specifically targeted for use with Discord bots. The most important thing to remember about Simulation is that it is a 'global' economy system. What does this mean? this means that no matter what Discord server you are in progression will always roll over and all users can access anything from any server at anytime. At this moment Simulation does not include nor support per guild economy progression yet, this feature may come as a seperate NPM package as I have no idea whether it's possible to include this in this current package due to how different the code is.

# Installation

To download the package just do:
```cli
npm i agenthyped-simulation
```
If any updates are released just do:
```cli
npm update agenthyped-simulation
```


# How to get started
First lets start of with the mandatory things. Include the module into your project.
```js
const Simulation = require('agenthyped-simulation');
```
Next you must provide a valid mongoDB url, as this module uses mongoDB to store data.
```js
Simulation.mongoURL("YOUR MONGODB CONNECTION STRING");
```

# Change-Log
#### READ THIS FIRST! IF YOU'RE AN ACTIVE USER OF THIS PACKAGE THEN YOU SHOULD ALWAYS REFER TO THE CHANGES FIRST AND UPDATE ANY CODE IN YOUR PROJECT, OTHERWISE NEW USERS CAN KEEP SCROLLING FOR THE METHODS

### Updates To Functions

Updated "Simulation.inventory" to include the "returnMapped" parameter, if the param has been set to true then will return the users items mapped out as per usual,
if the param is set to anything other than true or is not provided at all then return the items and the quantity in an object which will now allow users to have more 
flexibilty and creativity in to display their users inventory

### Added Functions

"Simulation.achievements.create" allows you to create achievements for your users to earn for reaching milestones or even given to users for your own purposes or uses for your project


"Simulation.achievements.getAll" grabs every users owned achievements and returns an object the same as the "Simulation.vaults.owned" method. See the functions for more information

# Functions

Before looking at the functions note you can always add a custom error message that is returned when using these functions. For example, 
if the daily functions returns the string "Daily cooldown has not expired yet." you can add a check to be able to send your own custom response.

```js
const dailyReward = await Simulation.daily(UserId, IncomeThreshold, currencyName)

if (dailyReward === "Daily cooldown has not expired yet.") {
    return `Your own response message or custom coding here.` // This will return any code that you put in this block if the daily function is on cooldown.
} else {
    return dailyReward // And this will return the amount the user earned if the cooldown is expired.
}
```
If a method is called to search for a user in the database, it will always return the string "No such user found in the database."
And if a method is called that involves the "currencyName" param, then it will always return "Currency not found." if invalid.

**balance**

Check the balance of a user.
```js
const balance = await Simulation.balance(UserId, currencyName)

console.log(balance) // Returns the amount of a specific currency you have stored in the database.
```

**affixMoney**

Add money to someones bank account.
```js
Simulation.affixMoney(UserId, Money, currencyName) // Adds money to the currency provided.
```

**daily**

Recieve a random amount of money between 1 and the income threshold that is set, you can set the income threshold as high as you want.
```js
const dailyReward = await Simulation.daily(UserId, IncomeThreshold, currencyName)

console.log(dailyReward) // Returns either the amount that is earned, or a cooldown message.
```

**removeMoney**

Remove money from a users bank account.
```js
Simulation.removeMoney(UserId, Money, currencyName)

/*
 For future reference you can just use the affixMoney function to remove money, for example doing this "-200".
 But this function is here if anyone needs it anyway.
*/
```

**createUser**

Creates a user in the database by providing the ID of the user.
```js
Simulation.createUser(UserId, currencyName) // Creates a document in the database tailored to the chosen user. You have to make sure you input a valid ID and currency name.
```

**deleteUser**

Deletes a user in the database by providing an ID of the user.
```js
Simulation.deleteUser(UserId) // This does the complete opposite of what is explained in the createUser function.
```

**leaderboard**

Displays a top 10 leaderboard of users who have the most money.
```js
const leaderboard = await Simulation.leaderboard(currencyName)

console.log(leaderboard) // Returns the top 10 users with the most currency provided in the database.
```

**giveMoney**

Send money to another users bank account.
```js
Simulation.giveMoney(UserId, UserIdSec, currencyName) // The first parameter is the user thats giving the money. The second parameter is the user that will receive it.
```
**doubleOrNothing**

A simple game where the user can place a bet with a chosen amount of money, if the user loses they lose the amount of money they bet, if they win they get the amount of money they bet.
```js
const game = await Simulation.doubleOrNothing(UserId, currencyName)
// When this is ran, it will return either strings "You win." or "You lost.". You can use these to setup your custom messages.
```

**inventory**

Grab anything that is in a users inventory from the database.
```js
const inventory = await Simulation.inventory(UserId)
console.log(inventory) // Returns either the items in the inventory or "No such user found in the database." and "You do not own anything." if there is nothing in the database.
```

**purchase**

Puts the item set in the parameter into the database. Also takes the amount set in the parameters and subtracts it from the users money.
```js
const purchase = await Simulation.purchase(UserId, Item, ItemPrice, currencyName) // Can return the message "You do not have enough money." if the amount of money in the users account is not enough
```

**gather.all**

Grab information for every existing schema in the database.
```js
const list = await Simulation.gather.all()

console.log(list) // This will return every user schema available. Can return "The database is empty." if nothing is found.
```

**gather.user**

Grab information on a users profile from the database.
```js
const profile = await Simulation.gather.user(UserId)

console.log(profile) // This will return a users document from the database which you can then use to access any information you need.

// For example you can do this

profile.LastUpdated // This will return the date their schema was last updated, it will be in the format of a javascript "new Date()" variable
profile.CooldownExpires // This will return the date there cooldown expires, it will also be in the format of a javascript "new Date()" variable

// You get the gist
```

**vaults.buy**

Purchase a vault to add to your schema.
```js
await Simulation.vaults.buy(UserId, Item, Cost, currencyName, capacity) // Updates a users schema to include a vault which can be used to store money in.

/*
 The "Item" param should be the name of the vault since the name will be used to access the vault in other functions.
 You can also provide a capacity, which sets the maximum amount of money that the vault can hold
 Can return "You do not have enough money." if you have insufficient funds.
 And "You already own this vault." if the vault name exists in the database.
*/
```

**vaults.owned**

View a list of vaults owned by the user.
```js
const list = await Simulation.vaults.owned(UserId)

console.log(list) // Displays all owned vaults in object form

// For example it will log this format:
 [
  { "name": "Gold Vault", "amount": "100", "capacity": "500" },
  { "name": "Silver Vault", "amount": "200", "capacity": "300" },
  { "name": "Bronze Vault", "amount": "50", "capacity": "No capacity limit" }
]
/*
 You can use this format to create you own designs when displaying vaults.
 My personal favourite is using the "forEach" method. Lets go through a quick tutorial.
*/
inv.forEach(element => { // Does a forEach method so basically saying "Do this for each one".
    Embed.addFields( // Adding the amount of fields to a Discord embed that match the amount of vaults the user owns.
        { 
            name: `\`${element.name}\``, // Display the name of the vault
            value: `**Amount:** ${element.amount}\n**Capacity** ${element.capacity}`, // Also display the amount in the vault and the capacity it can hold
            inline: true 
        }
    );
});
/*
 You can only call "name" and "amount" elements. the "capacity" element is optional depending on if you have a capacity stored in the db for your vaults, 
 if not, then it will return "No capacity limit"
*/
```

**vaults.deposit**

Deposit money from your chosen currency into the vault.
```js
await Simulation.vaults.deposit(UserId, Vault, Money, currencyName)

/*
 This will take the chosen amount of money from the "Money" param, subtract from the chosen currency and add
 it onto the amount that's in the vault, you must provide a vault name that matches any of the vaults in the
 users schema.

 You can also provide a capacity, which sets the maximum amount of money for the vault

 If a vault name does not match the one provided in the "Vault" param it will return "Vault not found."
 And if you do not have enough money to deposit it will return "You do not have enough money."
/*
```

**vaults.withdraw**

Withdraw money from your chosen vault and add that money to your chosen currency.
```js
await Simulation.vaults.withdraw(UserId, Vault, Money, currencyName)

/*
 Pretty much the same as the vaults.deposit method except it's the opposite.
 The only being is that if you don't have enough to withdraw from your vault it will return "You don't have that much in your vault."
*/
```

**currency.create**

Create a currency name and add a custom amount to every users schema in the database.
```js
await Simulation.currency.create(currencyName, currencyAmount)

/*
 This will create a new currency for every users schema in the database. You can customize the currency name (spaces included), and 
 provide an amount that the users start of with.
*/
```

**currency.delete**

Deletes a currency for all users schemas in the database.
```js
await Simulation.currency.delete(currencyName) // Finds a currency with the name provided and deletes it for all users schemas.
```

**achievements.create**

Create an achievement for a user to work towards or use for your own purposes to create something.
```js
await Simulation.achievements.create(UserId, achievementName, achievementDescription, difficulty)

/*
 This will create a custom achievement in the database,
 the "difficulty" parameter is optional and isn't needed
*/
```

**achievements.getAll**

Retrieve all achievements stored in the database for a specific user.
```js
const achievements = await Simulation.achievements.getall(UserId)

console.log(achievements)

/*
 This will return all the users owned achievements in the database.
 Since the difficulty param is optional, if it is not provided then
 it will return "No difficulty".
 Also it will return all of the information in an object, so you may
 use methods to access it. All available methods are:
*/

achievements.name
achievements.description
achievements.difficulty // Return "No difficulty" if you didn't set a difficulty for the achievement.

/*
 Can return "You do not have any achievements." if no achievements have been stored or found for the user.
*/
```
