const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {type: String},
    name: {type: String},
    picture: {type: String},
    remaining_task: [],
    completed_task: []
},
    { collection: "Users" }
);

const model = mongoose.model("User", userSchema);

module.exports = model;