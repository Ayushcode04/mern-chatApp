import express from "express";
import protectRoute from "../middelware/protectRoute.js";
import { 
    createGroup, 
    getUserGroups, 
    getGroupById, 
    updateGroup, 
    deleteGroup,
    addGroupMembers,
    removeGroupMember,
    leaveGroup
} from "../controllers/group.controller.js";

const router = express.Router();

// Group management routes
router.post("/create", protectRoute, createGroup);
router.get("/", protectRoute, getUserGroups);
router.get("/:id", protectRoute, getGroupById);
router.put("/:id", protectRoute, updateGroup);
router.delete("/:id", protectRoute, deleteGroup);

// Group membership routes
router.post("/:id/members", protectRoute, addGroupMembers);
router.delete("/:id/members/:memberId", protectRoute, removeGroupMember);
router.post("/:id/leave", protectRoute, leaveGroup);

export default router;