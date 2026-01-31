import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, enum: ['main_admin', 'sub_admin'], required: true },
    faceDescriptor: { type: [Number], required: false }, // Store 128-d vector
    createdBy: { type: String, required: false }, // ID of creating admin (for sub_admins)
    createdAt: { type: Date, default: Date.now }
});

export const AdminModel = mongoose.model('Admin', adminSchema);
