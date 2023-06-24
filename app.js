const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const posthog = require("posthog-js");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const apiKey = "phc_";
const apiUrl = "https://app.posthog.com";
const mongodbUrl = "";
const dbName = "test";
const collectionName = "collections";

const identifyUser = async (user) => {
  try {
    const response = await axios.post(`${apiUrl}/capture`, {
      api_key: apiKey,
      distinct_id: user._id.toString(),
      event: "$identify",
      properties: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    console.log(`User identified: ${user._id}`);
  } catch (error) {
    console.error(`Error identifying user ${user._id}:`, error.message);
  }
};

const connectToMongoDB = async () => {
  try {
    const client = new MongoClient(mongodbUrl);

    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const mongoCollection = db.collection(collectionName);

    const users = await mongoCollection.find().toArray();

    for (const user of users) {
      await identifyUser(user);
    }

    console.log("User identification complete");

    // Insert new user into MongoDB on signup
    app.post("/signup", async (req, res) => {
      const { email, password } = req.body;

      const data = {
        email: email,
        password: password,
      };

      try {
        const check = await mongoCollection.findOne({ email: email });

        if (check) {
          return res.json({ status: 200, message: "exist", data: check }); // Add a return statement here
        } else {
          const newUser = await mongoCollection.insertOne(data);
          await identifyUser(data); // Identify the newly signed up user
          return res.json({ status: 400, message: "notexist", data: newUser }); // Add a return statement here
        }
      } catch (e) {
        return res.json("fail"); // Add a return statement here
      }
    });

    app.listen(8000, () => {
      console.log("Port connected");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

connectToMongoDB();
