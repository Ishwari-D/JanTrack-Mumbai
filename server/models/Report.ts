import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reporterId: { type: String, required: true }, // User ID
    reporterName: { type: String, required: true }, // Username
    candidateId: { type: String, required: true },
    candidateName: { type: String, required: true },
    reason: { type: String, required: true }, // e.g., 'Hate Speech', 'False Info'
    description: { type: String },
    status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export const ReportModel = mongoose.model('Report', reportSchema);
