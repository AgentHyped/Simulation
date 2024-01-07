const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    UserID: { type: String },
    Money: { type: Number, default: 0 },
    Inventory: { type: Object },
    LastUpdated: { type: Date, default: new Date() },
    CooldownExpires: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Simulation', UserSchema);
