// Importing necessary modules and dependencies
import express from "express";
import { config } from "dotenv";
import { initiateApp } from "./src/initiate.app.js";
// Configuring environment variables
config({ path: "./config/dev.config.env" });

// Creating an Express application instance
const app = express();



initiateApp(app, express)

