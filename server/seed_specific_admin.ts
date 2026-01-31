import { connectDB } from './db';
import { UserModel } from './models/User';
import { AdminModel } from './models/Admin';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const adminData = {
    _id: "697629e0e4a9dcdb86110a39",
    username: "omkar_jantrack",
    email: "omkardhakanecloud@gmail.com",
    password: "d11930dd8876ea24aa9cf791faabb83ce563e43a234006b28c012a6a23a1675ab89915e8ec855191907bc2b958e47325ec74aaf9f8819e762ee094fc801ff6b7.c8f1a25e671f836805e8d75d58cb70cd",
    name: "Omkar Dhakane",
    role: "main_admin", // Enforcing main_admin role
    createdAt: new Date("2026-01-25T14:34:08.304Z")
};

async function run() {
    try {
        await connectDB();

        console.log(`Upserting admin: ${adminData.username}`);

        // Check if user exists in UserModel and delete (cleanup/migrate)
        const existingUser = await UserModel.findOne({
            $or: [{ _id: adminData._id }, { username: adminData.username }]
        });
        if (existingUser) {
            console.log("Found admin credentials in Users collection. Deleting to migrate to Admins collection...");
            await UserModel.findByIdAndDelete(existingUser._id);
        }

        // Now upsert into AdminModel
        const existingAdmin = await AdminModel.findOne({
            $or: [
                { _id: adminData._id },
                { username: adminData.username }
            ]
        });

        if (existingAdmin) {
            console.log('Admin entry exists, updating...');
            existingAdmin.username = adminData.username;
            existingAdmin.email = adminData.email;
            existingAdmin.password = adminData.password;
            existingAdmin.role = 'main_admin';

            await existingAdmin.save();
            console.log('Admin updated successfully in Admins collection.');
        } else {
            console.log('Admin does not exist in Admins collection, creating...');
            const newAdmin = new AdminModel({
                ...adminData,
                _id: new mongoose.Types.ObjectId(adminData._id)
            });
            await newAdmin.save();
            console.log('Admin created successfully in Admins collection.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Failed to seed specific admin:', err);
        process.exit(1);
    }
}

run();
