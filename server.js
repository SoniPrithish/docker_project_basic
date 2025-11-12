const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Use an environment variable for Mongo connection; default to local no-auth
// Examples:
//   export MONGO_URL="mongodb://localhost:27017"
//   export MONGO_URL="mongodb://user:pass@localhost:27017"
const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:qwerty@localhost:27017/?authSource=admin";
const client = new MongoClient(MONGO_URL);

let db = null;

async function start() {
    try {
    await client.connect();
        db = client.db("docker-db");
        console.log('Connected successfully to MongoDB');
    } catch (err) {
        // Log and keep server running; routes will return 500 if DB isn't available
        console.error('MongoDB connection failed:', err && err.message ? err.message : err);
        db = null;
    }

    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
}

//GET all users
app.get("/getUsers", async (req, res) => {
    if (!db) return res.status(500).send({ error: 'Database not connected' });
    try {
        const data = await db.collection('users').find({}).toArray();
        res.send(data);
    } catch (err) {
        console.error('Error in /getUsers:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

//POST new user
app.post("/addUser", async (req, res) => {
    const userObj = req.body;
    console.log(userObj);
    if (!db) return res.status(500).send({ error: 'Database not connected' });
    try {
        const result = await db.collection('users').insertOne(userObj);
        console.log('Inserted:', result.insertedId);
        res.send({ insertedId: result.insertedId });
    } catch (err) {
        console.error('Error in /addUser:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Graceful shutdown and global handlers
process.on('SIGINT', async () => {
    console.log('\nSIGINT received: closing MongoDB client and exiting');
    try { await client.close(); } catch (e) {}
    process.exit(0);
});

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
    // decide whether to exit; for now, log and keep running
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // exit after logging - an uncaught exception often leaves process in unknown state
    process.exit(1);
});

start();