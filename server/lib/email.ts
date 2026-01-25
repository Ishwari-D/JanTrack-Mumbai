import nodemailer from "nodemailer";

// Simple interface for sending emails
export interface EmailService {
    sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}

class NodemailerService implements EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            console.log("Email service configured with SMTP");
        } else {
            console.log("SMTP credentials missing. Email service will log to console only.");
        }
    }

    async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
        if (!this.transporter) {
            console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
            console.log(`[MOCK EMAIL] Body: ${html}`);
            return true;
        }

        try {
            await this.transporter.sendMail({
                from: `"JanTrack Admin" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });
            return true;
        } catch (error) {
            console.error("Failed to send email:", error);
            return false;
        }
    }
}

export const emailService = new NodemailerService();
