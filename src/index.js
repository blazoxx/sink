// require("dotenv").config({path: "./src/config/.env"});
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path: "./src/config/.env"
});



connectDB()                    // 1. Try to connect to MongoDB
.then(() => {                  // 2. If connection succeeds
    app.on("error", (error) => {
      console.error("Error:", error);
      throw error;
    });                        // 3. Set up error listener for Express app
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is listening at PORT: ${process.env.PORT || 8000}`)
    })                          // 4. Start the server
})
.catch((error) => {            // 5. If connection fails
    console.log(`MongoDB connection failed !!!`, error)         // 6. Log the error
})


















// import express from "express";

// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.error("Error:", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("Database connection error:", error);
//     throw error;
//   }
// })();
