// Importing the mongoose library for MongoDB interaction
import mongoose from "mongoose";

// Asynchronous function for establishing a database connection
const db_connection = async () => {
  // Attempting to connect to the MongoDB database using the connection URL from environment variables
    await mongoose
    .connect(process.env.CONNECTION_URL_LOCAL)
    // Handling successful database connection
    .then((res) => console.log("db connection successfully"))
    // Handling failed database connection and logging the error
    .catch((err) => console.log("db connection failed", err));
};

// Exporting the database connection function as the default export
export default db_connection;
