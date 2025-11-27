const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// Get chat history
router.get('/:type', auth, async (req, res) => {
    try {
        const { type } = req.params;
        const { groupId, recipientId } = req.query;
        let query = { type };

        if (type === 'personal') {
            query.$or = [
                { sender: req.user.id, recipient: recipientId },
                { sender: recipientId, recipient: req.user.id }
            ];
        } else if (groupId) {
            query.groupId = groupId;
        }

        const messages = await Message.find(query)
            .populate('sender', 'name email') // Populate sender details
            .sort({ timestamp: 1 }); // Oldest first

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Send a message
router.post('/', auth, async (req, res) => {
    try {
        const { content, type, recipient, groupId } = req.body;

        const newMessage = new Message({
            sender: req.user.id,
            content,
            type,
            recipient,
            groupId
        });

        const message = await newMessage.save();
        // Populate sender for the response
        await message.populate('sender', 'name email');

        res.json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
