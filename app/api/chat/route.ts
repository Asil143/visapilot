import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/claude/client";
import { createAdminClient } from "@/lib/supabase/server";
import { checkAndConsumeAIQuota } from "@/lib/supabase/subscription";
import { formatDateLong } from "@/lib/utils/date";
import { z } from "zod";
import { allowRequest } from "@/lib/utils/rate-limit";

const chatPayloadSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(12_000),
  })).min(1).max(30),
});

async function buildUserContext(userId: string): Promise<string> {
  const supabase = createAdminClient();

  const [profileResult, casesResult, monitoredResult, optResult] = await Promise.allSettled([
    supabase.from("profiles").select("*").eq("clerk_id", userId).single(),
    supabase.from("visa_cases").select("visa_type,title,status,receipt_number,expiry_date").eq("clerk_id", userId),
    supabase.from("monitored_cases").select("receipt_number,form_type,label,last_status").eq("clerk_id", userId),
    supabase.from("opt_tracker").select("opt_type,periods").eq("user_id", userId).single(),
  ]);

  const profile = profileResult.status === "fulfilled" ? profileResult.value.data : null;
  const visaCases = casesResult.status === "fulfilled" ? (casesResult.value.data ?? []) : [];
  const monitored = monitoredResult.status === "fulfilled" ? (monitoredResult.value.data ?? []) : [];
  const optTracker = optResult.status === "fulfilled" ? optResult.value.data : null;

  if (!profile) return "";

  const lines: string[] = ["=== USER PROFILE CONTEXT ==="];
  const fmt = (d: string | null) => d ? formatDateLong(d) : null;
  const daysUntil = (d: string | null) => d ? Math.ceil((new Date(d).getTime() - Date.now()) / 86400000) : null;
  const daysLabel = (d: string | null) => {
    const n = daysUntil(d);
    if (n === null) return null;
    if (n < 0) return `EXPIRED ${Math.abs(n)} days ago`;
    if (n === 0) return "expires TODAY";
    return `expires in ${n} days`;
  };

  if (profile.visa_type) lines.push(`Current Visa Status: ${profile.visa_type}`);
  if (profile.country_of_birth) lines.push(`Country of Birth: ${profile.country_of_birth}`);
  if (profile.employer) lines.push(`Current Employer: ${profile.employer}`);

  // Key dates
  const keyDates: string[] = [];
  if (profile.passport_expiry) keyDates.push(`Passport: ${fmt(profile.passport_expiry)} (${daysLabel(profile.passport_expiry)})`);
  if (profile.visa_stamp_expiry) keyDates.push(`Visa Stamp: ${fmt(profile.visa_stamp_expiry)} (${daysLabel(profile.visa_stamp_expiry)})`);
  if (profile.i94_is_ds) {
    keyDates.push("I-94: Duration of Status (D/S)");
  } else if (profile.i94_expiry) {
    keyDates.push(`I-94: ${fmt(profile.i94_expiry)} (${daysLabel(profile.i94_expiry)})`);
  }
  if (profile.i20_end_date) keyDates.push(`I-20 Program End: ${fmt(profile.i20_end_date)} (${daysLabel(profile.i20_end_date)})`);
  if (profile.ead_expiry) keyDates.push(`EAD: ${fmt(profile.ead_expiry)} (${daysLabel(profile.ead_expiry)})`);
  if (profile.opt_start_date) keyDates.push(`OPT Start: ${fmt(profile.opt_start_date)}`);
  if (profile.opt_end_date) keyDates.push(`OPT End: ${fmt(profile.opt_end_date)} (${daysLabel(profile.opt_end_date)})`);
  if (profile.stem_opt_start_date) keyDates.push(`STEM OPT Start: ${fmt(profile.stem_opt_start_date)}`);
  if (profile.stem_opt_end_date) keyDates.push(`STEM OPT End: ${fmt(profile.stem_opt_end_date)} (${daysLabel(profile.stem_opt_end_date)})`);
  if (profile.h1b_start_date) keyDates.push(`H-1B Start: ${fmt(profile.h1b_start_date)}`);
  if (profile.h1b_expiry) keyDates.push(`H-1B Expiry: ${fmt(profile.h1b_expiry)} (${daysLabel(profile.h1b_expiry)})`);
  if (profile.advance_parole_expiry) keyDates.push(`Advance Parole: ${fmt(profile.advance_parole_expiry)} (${daysLabel(profile.advance_parole_expiry)})`);
  if (profile.j1_end_date) keyDates.push(`J-1 Program End: ${fmt(profile.j1_end_date)} (${daysLabel(profile.j1_end_date)})`);
  if (profile.tn_expiry) keyDates.push(`TN Expiry: ${fmt(profile.tn_expiry)} (${daysLabel(profile.tn_expiry)})`);
  if (profile.l1_expiry) keyDates.push(`L-1 Expiry: ${fmt(profile.l1_expiry)} (${daysLabel(profile.l1_expiry)})`);
  if (profile.h4_ead_expiry) keyDates.push(`H-4 EAD Expiry: ${fmt(profile.h4_ead_expiry)} (${daysLabel(profile.h4_ead_expiry)})`);

  if (keyDates.length > 0) {
    lines.push("\nKey Dates:");
    keyDates.forEach(d => lines.push(`  • ${d}`));
  }

  // Green card
  if (profile.green_card_stage) {
    lines.push(`\nGreen Card Stage: ${profile.green_card_stage}`);
    if (profile.green_card_category) lines.push(`Green Card Category: ${profile.green_card_category}`);
    if (profile.priority_date) lines.push(`Priority Date: ${fmt(profile.priority_date)}`);
    if (profile.i140_approval_date) lines.push(`I-140 Approval Date: ${fmt(profile.i140_approval_date)}`);
    if (profile.perm_filing_date) lines.push(`PERM Filing Date: ${fmt(profile.perm_filing_date)}`);
  }

  // OPT tracker (unemployment days)
  if (optTracker) {
    const periods: { start: string; end: string | null }[] = optTracker.periods ?? [];
    const totalDays = periods.reduce((acc: number, p: { start: string; end: string | null }) => {
      const end = p.end ? new Date(p.end) : new Date();
      const start = new Date(p.start);
      return acc + Math.max(0, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    }, 0);
    const max = optTracker.opt_type === "stem" ? 150 : 90;
    lines.push(`\nOPT Unemployment Tracking (${optTracker.opt_type === "stem" ? "STEM OPT" : "Standard OPT"}): ${totalDays}/${max} days used`);
  }

  // Visa cases
  if (visaCases.length > 0) {
    lines.push("\nVisa Cases:");
    visaCases.forEach((c: { visa_type: string; title: string; status: string; receipt_number: string | null; expiry_date: string | null }) => {
      let line = `  • ${c.title} (${c.visa_type}) — ${c.status}`;
      if (c.receipt_number) line += ` | Receipt: ${c.receipt_number}`;
      if (c.expiry_date) line += ` | Expires: ${fmt(c.expiry_date)}`;
      lines.push(line);
    });
  }

  // Monitored USCIS cases
  if (monitored.length > 0) {
    lines.push("\nUSCIS Receipt Tracking:");
    monitored.forEach((c: { receipt_number: string; form_type: string; label: string | null; last_status: string | null }) => {
      let line = `  • ${c.receipt_number} (${c.form_type})`;
      if (c.label) line += ` — ${c.label}`;
      if (c.last_status) line += ` | Status: ${c.last_status}`;
      lines.push(line);
    });
  }

  lines.push("\n=== END USER PROFILE ===");
  lines.push("Use the above profile to give personalized answers. Reference specific dates and statuses when relevant. Always note if data looks incomplete and ask the user to update their profile.");

  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!allowRequest(`chat:${userId}`, 20, 60 * 1000)) {
    return NextResponse.json({ error: "You are sending messages too quickly. Please wait a moment." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = chatPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Messages must contain 1–30 valid text messages." }, { status: 400 });
  }

  const quotaError = await checkAndConsumeAIQuota(userId);
  if (quotaError) {
    return NextResponse.json({ error: quotaError }, { status: 429 });
  }

  const { messages } = parsed.data;

  // Fetch user context and inject into system prompt
  const userContext = await buildUserContext(userId);
  const systemPrompt = userContext
    ? `${SYSTEM_PROMPT}\n\n${userContext}`
    : SYSTEM_PROMPT;

  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
