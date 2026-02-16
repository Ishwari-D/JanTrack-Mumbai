import mongoose from 'mongoose';

const promiseSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['completed', 'in-progress', 'not-started', 'broken']
    },
    category: String,
    completionPercentage: Number
});

const projectSchema = new mongoose.Schema({
    name: String,
    cost: Number,
    status: String
});

const candidateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, index: true },
    party: { type: String, index: true },
    constituency: { type: String, index: true },
    ward: { type: String, index: true },
    gender: String,
    age: Number,
    education: String,
    image: String,
    criminalCases: Number,
    assets: String,
    attendance: Number,
    promises: [promiseSchema],
    funds: {
        allocated: Number,
        utilized: Number,
        projects: [projectSchema]
    },
    bio: String
});

// Compound index for frequent queries like getting candidates by ward + party
candidateSchema.index({ ward: 1, party: 1 });

export const CandidateModel = mongoose.model('Candidate', candidateSchema);
