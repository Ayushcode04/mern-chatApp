import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    groupIcon: {
        type: String,
        default: "https://avatar.iran.liara.run/public/group"
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupMessage',
        default: [],
    }]
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);

export default Group;