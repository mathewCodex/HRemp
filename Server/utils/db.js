// import pg from "pg";
// import dotenv from "dotenv";

// const saltRounds = 10;
// dotenv.config();

// const db = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "work_suite_db",
//   password: process.env.DB_PASSWORD,
//   port: 5432,
// });
// db.connect((err) => {
//   if (err) {
//     console.log("Error establishing Connection", err);
//   } else {
//     console.log("Connection Succesfull");
//   }
// });

// export default db;


// import mongoose from "mongoose";

// const connectToDatabase = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URL).then(()=> console.log('Connected to db'))
//     } catch(error){
//         console.log(error)
//     }
// }

// export default connectToDatabase;
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit process on connection failure
  }
};

export default connectDB;