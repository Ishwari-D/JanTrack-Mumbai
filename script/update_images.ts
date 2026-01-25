
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../server/db';
import { CandidateModel } from '../server/models';

async function updateImages() {
    await connectDB();

    try {
        console.log('Starting image update...');

        // Update all Female candidates
        const femaleResult = await CandidateModel.updateMany(
            { gender: 'Female' },
            { $set: { image: '/assets/candidate_female.png' } }
        );
        console.log(`Updated ${femaleResult.modifiedCount} female candidates.`);

        // Update all Male candidates
        const maleResult = await CandidateModel.updateMany(
            { gender: 'Male' },
            { $set: { image: '/assets/candidate_male.png' } }
        );
        console.log(`Updated ${maleResult.modifiedCount} male candidates.`);

        // Also update by specific IDs if gender is missing or for specific overrides if needed
        // (Optional based on current data state)

        console.log('Image update complete.');
        process.exit(0);
    } catch (error) {
        console.error('Update error:', error);
        process.exit(1);
    }
}

updateImages();
