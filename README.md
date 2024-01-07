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

# Functions

**balance**

Check the balance of a user.
```js
Simulation.balance(UserId)  
```
- Output: Number.

**affixMoney**

Add money to someones bank account.
```js
Simulation.affixMoney(UserId, Money)
```
- Output: Updates the money in your database.

**daily**

Recieve a random amount of money between 1 and the income threshold that is set, you can set the income threshold as high as you want.
```js
Simulation.daily(UserId, IncomeThreshold)
```
- Output: Updates the money in your database by a random amount. Also returns a string that shows the random amount the user earned.

**removeMoney**

Remove money from a users bank account.
```js
Simulation.removeMoney(UserId, Money)
```
-Output: Updates the money in your database.

**createUser**

Creates a user in the database by providing the ID of the user.
```js
Simulation.createUser(UserId)
```
- Output: Creates a document in the database.

**deleteUser**

Deletes a user in the database by providing an ID of the user.
```js
Simulation.deleteUser(UserId)
```
- Output: Deletes a document in the database.

**leaderboard**

Displays a top 10 leaderboard of users who have the most money.
```js
Simulation.leaderboard()
```
- Output: Returns an array of 10 users with the most money.

**giveMoney**

Send money to another users bank account.
```js
Simulation.giveMoney(UserId, UserIdSec, Money)
```
- Output: Subtracts the amount of money from the senders account and adds the money to the recievers account.
