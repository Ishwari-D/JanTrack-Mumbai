import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    adminName: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
        // e.g., 'CREATE_CANDIDATE', 'UPDATE_CANDIDATE', 'DELETE_CANDIDATE',
        //       'VERIFY_ISSUE', 'DELETE_ISSUE',
        //       'UPDATE_REPORT_STATUS',
        //       'CREATE_SUB_ADMIN'
    },
    entityType: {
        type: String,
        required: true,
        enum: ['CANDIDATE', 'ISSUE', 'REPORT', 'USER', 'ADMIN'],
    },
    entityId: {
        type: String, // Storing as string to be flexible, or ObjectId if strict
        required: true,
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // flexible object for storing what changed or titles
        default: {},
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export const ActivityLogModel = mongoose.model("ActivityLog", activityLogSchema);
