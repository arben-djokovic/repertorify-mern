import { mongoose } from "mongoose";
import app from "./app.js";
import { PORT, MONGODB_URI, JWT_SECRET, REFRESH_JWT_SECRET } from "./config/index.js";

if (!JWT_SECRET || !REFRESH_JWT_SECRET || JWT_SECRET === REFRESH_JWT_SECRET) {
  console.error("JWT_SECRET and REFRES_JWT_SECRET must both be set and must be different");
  process.exit(1);
}


mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB conencted successfully"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
