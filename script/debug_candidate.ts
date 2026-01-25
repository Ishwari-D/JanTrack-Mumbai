
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../server/db';
import { CandidateModel } from '../server/models';

async function debugCandidate() {
    await connectDB();

    try {
        const candidate = await CandidateModel.findOne({ name: "Forum Jiten Parmar" });
        if (candidate) {
            console.log("Candidate Found:");
            console.log("Name:", candidate.name);
            console.log("Gender:", candidate.gender);
            console.log("Image:", candidate.image);
            console.log("ID:", candidate.id);
        } else {
            console.log("Candidate 'Forum Jiten Parmar' not found.");
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugCandidate();
