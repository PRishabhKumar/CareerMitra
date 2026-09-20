import dotenv from "dotenv"
import path from "path"

// load .env from the project root before importing anything that reads process.env
dotenv.config({ path: path.resolve(import.meta.dirname, '..', '.env') })

// Dynamically add MiKTeX path on Windows to avoid PATH refresh issues
if (process.platform === "win32") {
  const localAppData = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || "", "AppData", "Local");
  const miktexPath = path.join(localAppData, "Programs", "MiKTeX", "miktex", "bin", "x64");
  process.env.PATH = `${miktexPath};${process.env.PATH}`;
}

// now import the app so all modules see the env vars
await import("./app.js")