import { type User, type InsertUser } from "@shared/schema"; // Keep this for user auth if needed, but we focus on Candidates
import { CandidateModel, UserModel, FeedbackModel, IssueModel, ReportModel, ActivityLogModel } from "./models";
import { AdminModel } from "./models/Admin";

// Use the same interface style if there was one, or adapt
// Looking at original storage.ts, it had IStorage for User.
// We should extended it or create a new one for Candidates if the app needs both.
// Accessing the previous file content from memory/history.
// Original file had getUser, getUserByUsername, createUser

// We need to support Candidates now too.
// Let's check if there is a shared schema for Candidate? 
// The user provided the interface in client/src/lib/mock-data.ts, so maybe no shared schema for it yet.
// We will define the interface here or import if possible (but cross-importing form client is bad).
// So we will just trust the Mongoose model returns the right shape.

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSubAdmins(createdBy: string): Promise<User[]>;

  // Candidate methods
  getCandidates(): Promise<any[]>;
  getCandidate(id: string): Promise<any | undefined>;
  createCandidate(candidate: any): Promise<any>;
  updateCandidate(id: string, candidate: any): Promise<any>;
  deleteCandidate(id: string): Promise<void>;

  // Feedback methods
  createFeedback(feedback: any): Promise<any>;
  getFeedbacksForCandidate(candidateId: string): Promise<any[]>;

  // Issue methods
  createIssue(issue: any): Promise<any>;
  getIssues(): Promise<any[]>;
  verifyIssue(id: string): Promise<any>;
  deleteIssue(id: string): Promise<void>;

  // Report methods
  createReport(report: any): Promise<any>;
  getReports(): Promise<any[]>;
  updateReportStatus(id: string, status: string): Promise<any>;

  // OTP methods
  saveOtp(username: string, otp: string): Promise<void>;
  verifyOtp(username: string, otp: string): Promise<boolean>;

  // Activity Log methods
  createActivityLog(log: any): Promise<any>;
  getActivityLogs(): Promise<any[]>;
}

export class MongoStorage implements IStorage {
  // Removing in-memory user storage, implementing real Mongo storage for users

  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // Simple in-memory OTP storage: Map<username, { otp: string, expires: number }>
  private otps = new Map<string, { otp: string, expires: number }>();

  async saveOtp(username: string, otp: string): Promise<void> {
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.otps.set(username, { otp, expires });
  }

  async verifyOtp(username: string, otp: string): Promise<boolean> {
    const record = this.otps.get(username);
    if (!record) return false;
    if (Date.now() > record.expires) {
      this.otps.delete(username);
      return false;
    }
    if (record.otp === otp) {
      this.otps.delete(username); // One-time use
      return true;
    }
    return false;
  }
  async getUser(id: string): Promise<User | undefined> {
    let user = await UserModel.findById(id);
    if (!user) user = await AdminModel.findById(id);
    if (!user) return undefined;
    return { id: user._id.toString(), username: user.username, password: user.password, role: user.role, email: user.email ?? null, createdBy: user.createdBy ?? null };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    let user = await UserModel.findOne({ username });
    if (!user) user = await AdminModel.findOne({ username });
    if (!user) return undefined;
    return { id: user._id.toString(), username: user.username, password: user.password, role: user.role, email: user.email ?? null, createdBy: user.createdBy ?? null };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    let user = await UserModel.findOne({ email });
    if (!user) user = await AdminModel.findOne({ email });
    if (!user) return undefined;
    return { id: user._id.toString(), username: user.username, password: user.password, role: user.role, email: user.email ?? null, createdBy: user.createdBy ?? null };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    let user;
    if (insertUser.role === 'main_admin' || insertUser.role === 'sub_admin') {
      user = new AdminModel(insertUser);
    } else {
      user = new UserModel(insertUser);
    }
    await user.save();
    return { id: user._id.toString(), username: user.username, password: user.password, role: user.role, email: user.email ?? null, createdBy: user.createdBy ?? null };
  }

  async getSubAdmins(createdBy: string): Promise<User[]> {
    const users = await AdminModel.find({ role: 'sub_admin', createdBy });
    return users.map(user => ({
      id: user._id.toString(),
      username: user.username,
      password: user.password,
      role: user.role,
      email: user.email ?? null,
      createdBy: user.createdBy ?? null
    }));
  }

  async setFaceDescriptor(username: string, descriptor: number[]) {
    // Only for Admins
    await AdminModel.findOneAndUpdate({ username }, { faceDescriptor: descriptor });
  }

  async getFaceDescriptor(username: string): Promise<number[] | null> {
    const admin = await AdminModel.findOne({ username });
    return admin && admin.faceDescriptor ? admin.faceDescriptor : null;
  }

  async getCandidates() {

    return await CandidateModel.find({});
  }

  async getCandidate(id: string) {
    return await CandidateModel.findOne({ id });
  }

  async createCandidate(candidateData: any) {
    const candidate = new CandidateModel(candidateData);
    return await candidate.save();
  }

  async updateCandidate(id: string, candidateData: any) {
    return await CandidateModel.findOneAndUpdate({ id }, candidateData, { new: true });
  }

  async deleteCandidate(id: string) {
    await CandidateModel.findOneAndDelete({ id });
  }

  async createFeedback(feedbackData: any) {
    const feedback = new FeedbackModel(feedbackData);
    return await feedback.save();
  }

  async getFeedbacksForCandidate(candidateId: string) {
    return await FeedbackModel.find({ candidateId }).sort({ createdAt: -1 });
  }

  async createIssue(issue: any) {
    const newIssue = new IssueModel(issue);
    return await newIssue.save();
  }

  async getIssues() {
    return await IssueModel.find({}).sort({ createdAt: -1 }).populate('userId', 'username');
  }

  async verifyIssue(id: string) {
    return await IssueModel.findByIdAndUpdate(id, { isVerified: true }, { new: true });
  }

  async deleteIssue(id: string) {
    await IssueModel.findByIdAndDelete(id);
  }

  async createReport(reportData: any) {
    const report = new ReportModel(reportData);
    return await report.save();
  }

  async getReports() {
    return await ReportModel.find({}).sort({ createdAt: -1 });
  }

  async updateReportStatus(id: string, status: string) {
    return await ReportModel.findByIdAndUpdate(id, { status }, { new: true });
  }



  async createActivityLog(log: any) {
    const newLog = new ActivityLogModel(log);
    return await newLog.save();
  }

  async getActivityLogs() {
    return await ActivityLogModel.find({}).sort({ timestamp: -1 });
  }
}

export const storage = new MongoStorage();
