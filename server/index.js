import app from "./app.js";
import dotenv from "dotenv";
import connectToDB from "./config/config.db.js";
import cloudinaryConfig from "./config/config.cloudinary.js";

dotenv.config();
cloudinaryConfig();

const PORT = process.env.PORT || 8081;

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server up and running at port - ${PORT}`);
});
