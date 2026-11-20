const mongoose = require("mongoose");
module.exports = async () => {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/construction-site-tracker");
  console.log("MongoDB connected");
};
