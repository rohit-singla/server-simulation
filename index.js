const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const mongodburl = process.env.mongodbURL || "mongodb://localhost:27017/user";
const mongodburl = process.env.MONGO_URL || "mongodb://localhost:27017/server-simulation";

mongoose
    .connect(mongodburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("DB Connected!");
    })
    .catch((err) => {
        console.log("Error in DB Connection!", err);
    });

app.get('/', (req, res) => {
    res.json({
	    message: "Working Fine!!"
    });
});

const controller = require('./controller.js');

app.post('/chatlogs/:userId', controller.saveUserChatLogs);
app.get('/chatlogs/:userId', controller.getUserChatLogs);
app.delete('/chatlogs/:userId', controller.deleteUserChatLogs);
app.delete('/chatlogs/:userId/:msgId', controller.deleteUserChatLogsForMsg);

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
    console.log(`MongodbURL: ${mongodburl}`);
});