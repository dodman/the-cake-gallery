import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export async function sendOrderEmail(to: string, subject: string, html: string) {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    console.log(`Mock email to ${to}: ${subject}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: { user: env.smtpUser, pass: env.smtpPass }
  });

  await transporter.sendMail({ from: env.emailFrom, to, subject, html });
}

export async function sendOrderSms(phone: string, message: string) {
  console.log(`Mock SMS to ${phone}: ${message}`);
}

