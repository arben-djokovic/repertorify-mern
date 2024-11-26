import { mongoose } from "mongoose";
import app from "./app.js";
import { PORT, MONGODB_URI } from "./config/index.js";


mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB conencted successfully"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
