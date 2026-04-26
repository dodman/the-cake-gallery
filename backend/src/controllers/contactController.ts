import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";
import { sendOrderEmail } from "../utils/notify.js";

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5)
});

// Public — submit a message
export const createMessage = asyncHandler(async (req, res) => {
  const msg = await prisma.contactMessage.create({
    data: { name: req.body.name, email: req.body.email, message: req.body.message }
  });
  res.status(201).json({ message: msg });
});

// Admin — list all messages (with replies)
export const listMessages = asyncHandler(async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: { replies: { orderBy: { sentAt: "asc" } } }
  });
  res.json({ messages });
});

// Admin — reply to a message
export const replyToMessage = asyncHandler(async (req, res) => {
  const content = z.string().min(1).parse(req.body.content);
  const msgId = String(req.params.id);

  const msg = await prisma.contactMessage.findUnique({ where: { id: msgId } });
  if (!msg) throw new ApiError(404, "Message not found");

  const reply = await prisma.contactReply.create({
    data: { messageId: msgId, content }
  });

  // Mark thread as read when admin replies
  await prisma.contactMessage.update({ where: { id: msgId }, data: { isRead: true } });

  // Send email to the person who contacted
  await sendOrderEmail(
    msg.email,
    "Re: Your message to The Cake Gallery",
    `<p>Hi ${msg.name},</p>
     <p>${content.replace(/\n/g, "<br>")}</p>
     <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
     <p style="color:#888;font-size:13px">
       <strong>Your original message:</strong><br>
       ${msg.message.replace(/\n/g, "<br>")}
     </p>
     <p style="color:#888;font-size:13px">— The Cake Gallery Team</p>`
  );

  res.status(201).json({ reply });
});

// Admin — mark message as read
export const markMessageRead = asyncHandler(async (req, res) => {
  const msg = await prisma.contactMessage.findUnique({ where: { id: String(req.params.id) } });
  if (!msg) throw new ApiError(404, "Message not found");
  const updated = await prisma.contactMessage.update({
    where: { id: String(req.params.id) },
    data: { isRead: true },
    include: { replies: { orderBy: { sentAt: "asc" } } }
  });
  res.json({ message: updated });
});

// Admin — delete message
export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await prisma.contactMessage.findUnique({ where: { id: String(req.params.id) } });
  if (!msg) throw new ApiError(404, "Message not found");
  await prisma.contactMessage.delete({ where: { id: String(req.params.id) } });
  res.status(204).send();
});
