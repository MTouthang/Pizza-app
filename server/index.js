import app from './app.js';
import dotenv from 'dotenv';
import connectToDB from './config/config.db.js';

dotenv.config();

const PORT = process.env.PORT || 8081;

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server up and running at port - ${PORT}`);
});
