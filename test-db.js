const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const uri = "mongodb+srv://ejimpatrick14_db_user:qIiseVoQruOHCW5R@quizzy.68ue8e9.mongodb.net/?appName=Quizzy";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:");
    console.error(error);
    process.exit(1);
  });