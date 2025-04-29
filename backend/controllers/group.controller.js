import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import { io } from "../socket/socket.js";

// Create a new group
export const createGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const admin = req.user._id;

        // Parse members if it's a string
        let memberIds = members;
        if (typeof members === 'string') {
            try {
                memberIds = JSON.parse(members);
            } catch (error) {
                memberIds = [members];
            }
        }

        // Make sure admin is also a member
        if (!memberIds.includes(admin.toString())) {
            memberIds.push(admin.toString());
        }

        const newGroup = new Group({
            name,
            description,
            admin,
            members: memberIds
        });

        if (newGroup) {
            await newGroup.save();
            
            // Return only necessary group info
            res.status(201).json({
                _id: newGroup._id,
                name: newGroup.name,
                description: newGroup.description,
                admin: newGroup.admin,
                members: newGroup.members,
                groupIcon: newGroup.groupIcon
            });
        } else {
            res.status(400).json({ error: "Invalid group data" });
        }
    } catch (error) {
        console.log("Error in createGroup controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all groups that the user is a member of
export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const groups = await Group.find({ 
            members: { $in: [userId] } 
        }).populate("admin", "username fullName profilePic");
        
        res.status(200).json(groups);
    } catch (error) {
        console.log("Error in getUserGroups controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a specific group by ID
export const getGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        const group = await Group.findById(id)
            .populate("admin", "username fullName profilePic")
            .populate("members", "username fullName profilePic");
        
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        
        // Check if user is a member of the group
        if (!group.members.some(member => member._id.toString() === userId.toString())) {
            return res.status(403).json({ error: "You are not a member of this group" });
        }
        
        res.status(200).json(group);
    } catch (error) {
        console.log("Error in getGroupById controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update group information
export const updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { name, description, members } = req.body;
        
        const group = await Group.findById(id);
        
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        
        // Only group admin can update the group
        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Only group admin can update the group" });
        }
        
        // Update group fields
        if (name) group.name = name;
        if (description) group.description = description;
        if (members) {
            // Parse members if it's a string
            let memberIds = members;
            if (typeof members === 'string') {
                try {
                    memberIds = JSON.parse(members);
                } catch (error) {
                    memberIds = [members];
                }
            }
            
            // Make sure admin is always a member
            if (!memberIds.includes(userId.toString())) {
                memberIds.push(userId.toString());
            }
            
            group.members = memberIds;
        }
        
        await group.save();
        
        // Return updated group
        res.status(200).json({
            _id: group._id,
            name: group.name,
            description: group.description,
            admin: group.admin,
            members: group.members,
            groupIcon: group.groupIcon
        });
    } catch (error) {
        console.log("Error in updateGroup controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a group
export const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        const group = await Group.findById(id);
        
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        
        // Only group admin can delete the group
        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Only group admin can delete the group" });
        }
        
        // Delete all messages in the group
        await GroupMessage.deleteMany({ groupId: id });
        
        // Delete the group
        await Group.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        console.log("Error in deleteGroup controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Add members to a group
export const addGroupMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { memberIds } = req.body;
        
        const group = await Group.findById(id);
        
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        
        // Only group admin can add members
        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Only group admin can add members" });
        }
        
        // Parse members if it's a string
        let newMemberIds = memberIds;
        if (typeof memberIds === 'string') {
            try {
                newMemberIds = JSON.parse(memberIds);
            } catch (error) {
                newMemberIds = [memberIds];
            }
        }
        
        // Add new members
        for (const memberId of newMemberIds) {
            if (!group.members.includes(memberId)) {
                group.members.push(memberId);
            }
        }
        
        await group.save();
        
        res.status(200).json({ message: "Members added successfully", group });
    } catch (error) {
        console.log("Error in addGroupMembers controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Remove members from a group
export const removeGroupMember = async (req, res) => {
    try {
        const { id, memberId } = req.params;
        const userId = req.user._id;
        
        const group = await Group.findById(id);
        
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        
        // Only group admin can remove members, or users can remove themselves
        if (group.admin.toString() !== userId.toString() && memberId !== userId.toString()) {
            return res.status(403).json({ error: "Only group admin can remove members" });
        }
        
        // Cannot remove admin from the group
        if (memberId === group.admin.toString()) {
            return res.status(403).json({ error: "Cannot remove admin from the group" });
        }
        
        // Remove member
        group.members = group.members.filter(member => member.toString() !== memberId);
        
        await group.save();
        
        res.status(200).json({ message: "Member removed successfully", group });
    } catch (error) {
        console.log("Error in removeGroupMember controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Leave group (for non-admin members)
export const leaveGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        const group = await Group.findById(id);
        
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        
        // Admin cannot leave the group, must delete it or transfer ownership
        if (group.admin.toString() === userId.toString()) {
            return res.status(403).json({ error: "Admin cannot leave the group. Transfer ownership or delete the group" });
        }
        
        // Remove user from members
        group.members = group.members.filter(member => member.toString() !== userId.toString());
        
        await group.save();
        
        res.status(200).json({ message: "Left group successfully" });
    } catch (error) {
        console.log("Error in leaveGroup controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};