import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string,
            {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            }
        );
        console.log("Connected to MongoDB");

        mongoose.connection.on('disconnected', () => {
            console.warn("MongoDB connection lost. Attempting to reconnect...");
        });

        mongoose.connection.on('reconnected', () => {
            console.log("MongoDB reconnected successfully.");
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default dbConnect;