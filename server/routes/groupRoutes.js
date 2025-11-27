const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const auth = require('../middleware/auth');

// Get all groups for the current user
router.get('/', auth, async (req, res) => {
    try {
        const groups = await Group.find({
            members: req.user._id
        })
            .populate('creator', 'name email')
            .populate('members', 'name email')
            .sort({ updatedAt: -1 });

        res.json({ success: true, groups });
    } catch (err) {
        console.error('Error fetching groups:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Create a new group
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, type, memberIds } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Group name is required' });
        }

        // Create group with creator and selected members
        // Ensure unique members and valid ObjectIds
        const uniqueMembers = new Set();
        uniqueMembers.add(req.user._id.toString());

        if (memberIds && Array.isArray(memberIds)) {
            memberIds.forEach(id => {
                if (id && typeof id === 'string') {
                    uniqueMembers.add(id);
                }
            });
        }

        const newGroup = new Group({
            name,
            description: description || '',
            type: type || 'personal',
            creator: req.user._id,
            members: Array.from(uniqueMembers)
        });

        await newGroup.save();

        // Populate before sending response
        await newGroup.populate('creator', 'name email');
        await newGroup.populate('members', 'name email');

        res.json({ success: true, group: newGroup });
    } catch (err) {
        console.error('Error creating group:', err);
        console.error('Request body:', req.body);
        console.error('User:', req.user._id);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Add member to group
router.post('/:groupId/members', auth, async (req, res) => {
    try {
        const { userId } = req.body;
        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        // Check if user is creator or already a member
        if (group.creator.toString() !== req.user._id.toString() && !group.members.includes(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Add member if not already in group
        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }

        await group.populate('members', 'name email');
        res.json({ success: true, group });
    } catch (err) {
        console.error('Error adding member:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Remove member from group
router.delete('/:groupId/members/:userId', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        // Only creator can remove members
        if (group.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Only group creator can remove members' });
        }

        // Don't allow removing the creator
        if (req.params.userId === group.creator.toString()) {
            return res.status(400).json({ success: false, message: 'Cannot remove group creator' });
        }

        group.members = group.members.filter(m => m.toString() !== req.params.userId);
        await group.save();

        await group.populate('members', 'name email');
        res.json({ success: true, group });
    } catch (err) {
        console.error('Error removing member:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Leave group
router.post('/:groupId/leave', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        // Creator cannot leave their own group
        if (group.creator.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Group creator cannot leave. Delete the group instead.' });
        }

        group.members = group.members.filter(m => m.toString() !== req.user._id.toString());
        await group.save();

        res.json({ success: true, message: 'Left group successfully' });
    } catch (err) {
        console.error('Error leaving group:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Delete group
router.delete('/:groupId', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        // Only creator can delete group
        if (group.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Only group creator can delete the group' });
        }

        await Group.findByIdAndDelete(req.params.groupId);
        res.json({ success: true, message: 'Group deleted successfully' });
    } catch (err) {
        console.error('Error deleting group:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
