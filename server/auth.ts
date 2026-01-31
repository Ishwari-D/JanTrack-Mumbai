import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "jan-track-secret",
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await storage.getUserByUsername(username);
                if (!user) {
                    return done(null, false, { message: "Incorrect username." });
                }

                // In a real app we would use comparePasswords here.
                // For simplicity with the mocked/hybrid storage, I'll ensure I use the same hashing logic.
                // Wait, I am implementing full mongo auth now.
                if (!await comparePasswords(password, user.password)) {
                    return done(null, false, { message: "Incorrect password." });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }),
    );

    passport.serializeUser((user, done) => {
        done(null, (user as User).id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    app.post("/api/register", async (req, res, next) => {
        try {
            const existingUser = await storage.getUserByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).send("Username already exists");
            }

            const hashedPassword = await hashPassword(req.body.password);

            console.log("Registering user:", req.body.username, "Role:", req.body.role);

            const user = await storage.createUser({
                ...req.body,
                role: 'user', // Force user role for public registration
                password: hashedPassword,
            });

            console.log("Created user:", user);

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(201).json(user);
            });
        } catch (err) {
            next(err);
        }
    });

    app.post("/api/login", (req, res, next) => {
        // Wrap passport.authenticate to allow custom logic
        passport.authenticate("local", async (err: any, user: User, info: any) => {
            if (err) return next(err);
            if (!user) return res.status(401).json(info);

            // Admin OTP Checks
            if (user.role === 'main_admin' || user.role === 'sub_admin') {
                // Face Verification for Sub-Admins
                if (user.role === 'sub_admin') {
                    const { faceDescriptor } = req.body;
                    if (!faceDescriptor) {
                        return res.status(403).json({ message: "Face verification required", requireFace: true });
                    }

                    const storedDescriptor = await storage.getFaceDescriptor(user.username);
                    if (!storedDescriptor) {
                        // If no face enrolled, maybe allow login or block?
                        // Blocking is safer based on "For more security". But if enrolled not done, they are locked out.
                        // Assuming enrollment is mandatory, but for initial transition maybe warn?
                        // User said "implement... for sub-admins".
                        // Use strict mode.
                        return res.status(403).send("Face not enrolled. Contact Main Admin.");
                    }

                    // Calculate Euclidean Distance
                    const distance = Math.sqrt(
                        storedDescriptor.reduce((sum, val, i) => sum + Math.pow(val - faceDescriptor[i], 2), 0)
                    );

                    console.log(`Face match distance for ${user.username}: ${distance}`);

                    if (distance > 0.6) { // Threshold 0.6 is typical for face-api.js (lower is better match)
                        return res.status(403).send("Face verification failed. Try again.");
                    }
                }

                // OTP verification (for both)
                const { otp } = req.body;
                if (!otp) {
                    return res.status(403).json({ message: "OTP required", requireOtp: true });
                }
                const isValid = await storage.verifyOtp(user.username, otp);
                if (!isValid) {
                    return res.status(403).send("Invalid or expired OTP");
                }
            }

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(200).json(user);
            });
        })(req, res, next);
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });
}
