import dotenv from "dotenv";

// ✅ load env FIRST
dotenv.config({
  path: new URL("../.env", import.meta.url).pathname
});

console.log(
  "ENV RAW:",
  process.env.FIREBASE_SERVICE_ACCOUNT ? "FOUND" : "MISSING"
);

// ✅ init firebase BEFORE app imports routes
import { initFirebase } from "./config/firebase.js";
initFirebase();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
