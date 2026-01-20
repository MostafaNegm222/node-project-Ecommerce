const mongoose = require("mongoose");

async function dbConnect() {
  try {
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log(`Database connected successfully at name ${conn.connection.name}`);
  } catch (err) {
    console.log(err)
  }
}


module.exports = dbConnect;
