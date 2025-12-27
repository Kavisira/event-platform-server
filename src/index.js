import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
console.log("ENV CHECK:", process.env ? "FOUND" : "NOT FOUND");

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
