# Introducing "Simulation" a NPM package for economy
DISCLAIMER! THIS PROJECT IS STILL IN DEVELOPMENT. USE AT YOUR OWN RISK

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
const Simulation = require("agenthyped-simulation");
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
- Output: Number

**affixMoney**

Add money to someones bank account.
```js
Simulation.affixMoney(UserId, Amount)
```
- Output: Updates the money in your database

**daily**

Recieve a random amount of money between 1 and 1000 and add it to your bank account.
```js
Simulation.daily(UserId)
```
- Output: Updates the money in your database by a random amount
