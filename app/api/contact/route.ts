import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { allowRequest } from "@/lib/utils/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL ?? "kamepalliasil143@gmail.com";

const attachmentSchema = z.object({
  filename: z.string().trim().min(1).max(160),
  content: z.string().min(1).max(10_000_000),
}).optional();

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(254),
  subject: z.string().trim().max(180, "Subject is too long").optional(),
  message: z.string().trim().min(10, "Message is too short").max(5000, "Message is too long"),
  attachment: attachmentSchema,
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!allowRequest(`contact:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const parsed = contactSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
    }
    const { name, email, subject, message, attachment } = parsed.data;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: adminEmail,
      replyTo: email,
      subject: subject ? `[StatusClock] ${subject}` : "[StatusClock] Contact Form Submission",
      text: `From: ${name} <${email}>\n\n${message}`,
      ...(attachment && {
        attachments: [{ filename: attachment.filename, content: attachment.content }],
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
