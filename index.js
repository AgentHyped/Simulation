const mongoose = require("mongoose");
require('./src/misc/checkVersion')
var mongooseUrl;

const balance = require('./src/functions/money/balance');
const daily = require('./src/functions/money/daily');
const affix = require('./src/functions/money/affix');
const remove = require('./src/functions/money/remove');
const create = require('./src/functions/user/create');
const trash = require('./src/functions/user/delete');
const leaderboard = require('./src/functions/leaderboard/money');
const give = require('./src/functions/user/give');
const doubleOrNothing = require('./src/functions/games/doubleOrNothing');
const inventory = require('./src/functions/user/inventory');
const purchase = require('./src/functions/items/item');
const GetAll = require('./src/functions/user/getAll');
const GetUser = require('./src/functions/user/getUser');
const OwnedVaults = require('./src/functions/user/vaults');
const BuyVaults = require('./src/functions/vaults/vaults');
const DepositIntoVault = require('./src/functions/vaults/deposit');
const WithdrawFromVault = require("./src/functions/vaults/withdraw");
const createCurrency = require("./src/functions/money/create");
const deleteCurrency = require("./src/functions/money/delete");
const createAchievements = require("./src/functions/achievements/create");
const getAllAchievements = require("./src/functions/vaults/withdraw");
const convertCurrency = require("./src/functions/money/convert")

class Simulation {

  static async mongoURL(mongoDBUrl) {
    if(!mongoDBUrl) throw new TypeError("A valid database url was not found. SOLUTION: Provide a MongoDB url");
    mongooseUrl = mongoDBUrl
    mongoose.set('strictQuery', true);
    return mongoose.connect(mongoDBUrl);
  }

  static async balance(UserId, currencyName) {
    return balance(UserId, currencyName);
  }

  static async daily(UserId, IncomeThreshold, currencyName) {
    return daily(UserId, IncomeThreshold, currencyName);
  }

  static get money() {
    return {
      affix: this.#affixMoney.bind(this),
      remove: this.#removeMoney.bind(this)
    };
  }

  static async #affixMoney(UserId, Money, currencyName) {
    return affix(UserId, Money, currencyName);
  }

  static async #removeMoney(UserId, Money, currencyName) {
    return remove(UserId, Money, currencyName);
  }

  static get user() {
    return {
      create: this.#createUser.bind(this),
      delete: this.#deleteUser.bind(this),
      give: this.#giveMoney.bind(this)
    };
  }

  static async #createUser(UserId, currencyName) {
    return create(UserId, currencyName);
  }

  static async #deleteUser(UserId) {
    return trash(UserId);
  }

  static async leaderboard(currencyName, topN = 10) {
    return leaderboard(currencyName, topN = 10);
  }

  static async #giveMoney(UserId, UserIdSec, Money, currencyName) {
    return give(UserId, UserIdSec, Money, currencyName);
  }

  static async doubleOrNothing(UserId, Money, currencyName) {
    return doubleOrNothing(UserId, Money, currencyName);
  }

  static async inventory(UserId, returnMapped){
    return inventory(UserId, returnMapped);
  }

  static async purchase(UserId, Item, Cost, currencyName){
    return purchase(UserId, Item, Cost, currencyName);
  }

  static get gather() {
    return {
      user: this.#GetUser.bind(this),
      all: this.#GetAll.bind(this)
    };
  }

  static async #GetAll() {
    return GetAll()
  }

  static async #GetUser(UserId){
    return GetUser(UserId)
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
    return OwnedVaults(UserId)
  }

  static async #BuyVaults(UserId, Item, Cost, currencyName, Capacity) {
    return BuyVaults(UserId, Item, Cost, currencyName, Capacity)
  }

  static async #DepositIntoVault(UserId, Vault, Money, currencyName){
    return DepositIntoVault(UserId, Vault, Money, currencyName);
  }

  static async #WithdrawFromVault(UserId, Vault, Money, currencyName){
    return WithdrawFromVault(UserId, Vault, Money, currencyName);
  }

  static get currency() {
    return {
      create: this.#createCurrency.bind(this),
      delete: this.#deleteCurrency.bind(this),
      convert: this.#convertCurrency.bind(this),
    };
  }

  static async #createCurrency(currencyName, currencyAmount){
    return createCurrency(currencyName, currencyAmount);
  }

  static async #deleteCurrency(currencyName){
    return deleteCurrency(currencyName);
  }

  static async #convertCurrency(UserId, currencyToConvert, currencyReceived, currencyAmount, rate){
    return convertCurrency(UserId, currencyToConvert, currencyReceived, currencyAmount, rate)
  }

  static get achievements() {
    return {
      create: this.#createAchievements.bind(this),
      retrieve: this.#getAllAchievements.bind(this),
    };
  }

  static async #createAchievements(UserId, achievementName, achievementDescription, difficulty){
    return createAchievements(UserId, achievementName, achievementDescription, difficulty);
  }

  static async #getAllAchievements(UserId){
    return getAllAchievements(UserId);
  }
}

module.exports = Simulation;
