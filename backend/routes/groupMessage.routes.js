import express from "express";
import protectRoute from "../middelware/protectRoute.js";
import { 
    sendGroupMessage, 
    getGroupMessages 
} from "../controllers/groupMessage.controller.js";

const router = express.Router();

router.post("/send/:id", protectRoute, sendGroupMessage);
router.get("/:id", protectRoute, getGroupMessages);

export default router;