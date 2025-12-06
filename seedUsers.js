const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seed() {
  await mongoose.connect("mongodb://127.0.0.1:27017/apartment-chef");

  await User.deleteMany({});

  const members = [
    { name: "Rohan", email: "rohan@example.com", password: "rohan123" },
    { name: "Amit", email: "amit@example.com", password: "amit123" },
    { name: "Sajan", email: "sajan@example.com", password: "sajan123" },
    { name: "Rajan", email: "rajan@example.com", password: "rajan123" },
    { name: "Saurav", email: "saurav@example.com", password: "saurav123" },
    { name: "Kuldeep", email: "kuldeep@example.com", password: "kuldeep123" },
  ];

  const data = [];

  for (const m of members) {
    const passwordHash = await bcrypt.hash(m.password, 10);
    data.push({
      name: m.name,
      email: m.email,
      passwordHash,
    });
  }

  await User.insertMany(data);
  console.log("✅ Users seeded");
  await mongoose.disconnect();
}

seed().catch((err) => console.error(err));
