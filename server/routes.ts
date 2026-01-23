import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload, uploadToCloudinary } from "./lib/cloudinary";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Candidate routes
  app.get("/api/candidates", async (req, res) => {
    try {
      const candidates = await storage.getCandidates();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const candidate = await storage.getCandidate(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });

  app.post("/api/candidates", async (req, res) => {
    try {
      if (!req.body) {
        console.log("POST /api/candidates: Missing body");
        return res.status(400).json({ message: "Missing body" });
      }
      console.log("POST /api/candidates payload:", JSON.stringify(req.body, null, 2));
      const candidate = await storage.createCandidate(req.body);
      res.status(201).json(candidate);
    } catch (error: any) {
      console.error("Error in POST /api/candidates:", error);
      res.status(500).json({ message: "Failed to create candidate", error: error.message });
    }
  });

  app.put("/api/candidates/:id", async (req, res) => {
    try {
      const candidate = await storage.updateCandidate(req.params.id, req.body);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to update candidate" });
    }
  });

  app.delete("/api/candidates/:id", async (req, res) => {
    try {
      await storage.deleteCandidate(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete candidate" });
    }
  });

  // Feedback routes
  app.post("/api/candidates/:id/feedback", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const feedback = await storage.createFeedback({
        ...req.body,
        candidateId: req.params.id,
        userId: (req.user as any).id,
        username: (req.user as any).username,
        createdAt: new Date()
      });
      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to create feedback" });
    }
  });

  app.get("/api/candidates/:id/feedback", async (req, res) => {
    try {
      const feedbacks = await storage.getFeedbacksForCandidate(req.params.id);
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedbacks" });
    }
  });

  // Issue routes
  app.post("/api/issues", upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { title, description, location } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const imageUrl = await uploadToCloudinary(req.file);

      const issue = await storage.createIssue({
        title,
        description,
        location,
        imageUrl,
        userId: (req.user as any).id,
        status: 'open'
      });
      res.status(201).json(issue);
    } catch (error: any) {
      console.error("Error creating issue:", error);
      res.status(500).json({ message: "Failed to create issue" });
    }
  });

  app.get("/api/issues", async (req, res) => {
    try {
      const issues = await storage.getIssues();
      res.json(issues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch issues" });
    }
  });

  app.patch("/api/issues/:id/verify", async (req, res) => {
    if (!req.isAuthenticated()) { // Ideally should check for admin role, but basic auth for now
      // In a real app, check req.user.role === 'admin'
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const issue = await storage.verifyIssue(req.params.id);
      if (!issue) return res.status(404).json({ message: "Issue not found" });
      res.json(issue);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify issue" });
    }
  });

  app.delete("/api/issues/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      await storage.deleteIssue(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete issue" });
    }
  });

  return httpServer;
}
