import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT;
console.log(PORT);

app.get("/", (req, res) => {
  res.send("Real-Time Collaborative Workspace");
});

app.listen(PORT, () => {
  console.log(`listening on the port ${PORT}`);
});
