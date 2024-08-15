const mongoose = require("mongoose");

const CurrencySchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Money' },
    amount: { type: Number, required: true, default: 0 }
});

const VaultSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'vault' },
    amount: { type: Number, required: true, default: 0 },
    capacity: { type: Number, required: false }
});

const AchievementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, required: false }
});

const UserSchema = new mongoose.Schema({
    UserID: { type: String },
    LastUpdated: { type: Date, default: new Date() },
    CooldownExpires: { type: Date, default: new Date() },
    Inventory: { type: Object, default: {} },
    Achievements: {
        type: [AchievementSchema],
        default: []
    },
    Currency: { 
        type: [CurrencySchema], 
        default: [
            { name: "Money", amount: 0 }
        ] 
    },
    Vaults: {
        type: [VaultSchema],
        default: []
    }
});

const SimulationUserSchema = mongoose.model('Simulation', UserSchema);

module.exports = {
    SimulationUserSchema: SimulationUserSchema,
}
