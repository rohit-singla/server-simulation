const chat = require('./models/chat');
const Chat = require('./models/chat');
const User = require('./models/user');

exports.saveUserChatLogs = async function (req, res) {
    try{
        let userId = req.params.userId;
        let user = await User.findOne({id: userId});
        if(!user) {
            user = new User({
                id: userId,
                chatlogs: []
            });
        }
        let msgId = generateUUID();
        let chat = new Chat({
            id: msgId,
            message: req.body.message,
            timestamp: req.body.timestamp,
            isSent: req.body.isSent
        });
        let chatObj = await chat.save();
        await user.chatlogs.push(chatObj);
        await user.save();
        res.status(200).send({ message: "User chatlogs added successfully!!", data: msgId });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

exports.getUserChatLogs = async function (req, res) {
    try {
        let start = req.query.start;
        let limit = req.query.limit || 10;
        let userId = req.params.userId;
        let user = await User.findOne({id: userId}).populate('chatlogs');
        let results = await Chat.find({_id: {$in: user.chatlogs}}).sort({'timestamp':-1}).limit(limit);
        if(user) {
            res.status(200).send(results.slice(0, limit));
        } else {
            res.status(403).send({ msg: 'Invalid request! User not found.' });
        }
    } catch (error) {
        console.error(error);
        //Internal server error
        res.status(500).send({ "message": "Error in getting chat logs" });
    }
};

exports.deleteUserChatLogs = async function (req, res) {
    try{
        let userId = req.params.userId;
        let user = await User.findOne({id: userId});
        if(user) {
            await Chat.deleteMany({_id: {$in: user.chatlogs}});
            user.chatlogs = [];
            await user.save();
            res.status(200).send({ message: "User chatlogs deleted successfully!!" });
        } else {
            res.status(403).send({ msg: 'Invalid request! User not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

exports.deleteUserChatLogsForMsg = async function (req, res) {
    try{
        let userId = req.params.userId;
        let msgId = req.params.msgId;
        let user = await User.findOne({id: userId}).populate('chatlogs');
        if(user) {
            let result = await Chat.deleteMany({_id: {$in: user.chatlogs}, id:msgId});
            user.chatlogs = user.chatlogs.filter(chat => chat.id !== msgId);
            await user.save();
            if (result.deletedCount > 0) {
                res.status(200).send({ message: `User chat with msgId ${msgId} deleted successfully!!` });
            } else {
                res.status(403).send({ msg: 'Invalid request! Msg not found.' });
            }
        } else {
            res.status(403).send({ msg: 'Invalid request! User not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

function generateUUID() {
    let uuidValue = "", k, randomValue;
    for (k = 0; k < 16;k++) {
      randomValue = Math.random() * 16 | 0;
      if (k == 8 || k == 12 || k == 16 || k == 20) {
        uuidValue += "-";
      }
      uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
    }
    return uuidValue;
};
