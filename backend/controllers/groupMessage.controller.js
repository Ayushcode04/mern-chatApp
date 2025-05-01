import Group from "../models/group.model.js";
import GroupMessage from "../models/groupMessage.model.js";
import { io } from "../socket/socket.js";

// Send a message to a group
export const sendGroupMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: groupId } = req.params;
        const senderId = req.user._id;

        // Check if group exists and user is a member
        const group = await Group.findById(groupId);
        
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (!group.members.includes(senderId)) {
            return res.status(403).json({ error: "You are not a member of this group" });
        }

        // Create new message
        const newMessage = new GroupMessage({
            senderId,
            groupId,
            message,
        });

        group.messages.push(newMessage._id);
        await Promise.all([group.save(), newMessage.save()]);

        // Populate sender info for frontend display
        const populatedMessage = await GroupMessage.findById(newMessage._id)
            .populate("senderId", "username fullName profilePic");

        // Emit to the group room
        io.to(`group:${groupId}`).emit("newGroupMessage", {
            message: populatedMessage,
            groupId: groupId
        });

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.log("Error in sendGroupMessage controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get messages for a specific group
export const getGroupMessages = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const userId = req.user._id;

        // Check if group exists and user is a member
        const group = await Group.findById(groupId)
            .populate({
                path: "messages",
                populate: {
                    path: "senderId",
                    select: "username fullName profilePic"
                }
            });

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (!group.members.includes(userId)) {
            return res.status(403).json({ error: "You are not a member of this group" });
        }

        res.status(200).json(group.messages);
    } catch (error) {
        console.log("Error in getGroupMessages controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};