import dotenv from "dotenv"
import path from "path"

// load .env before importing anything that reads process.env
dotenv.config({ path: path.resolve("../.env") })

// now import the app so all modules see the env vars
await import("./app.js")