import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

const mongoConnstring = process.env.MONGO_CONNSTRING || "mongodb://localhost";

mongoose
  .connect(mongoConnstring)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.get("/", (req, res) => {
  res.render("pages/index");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
