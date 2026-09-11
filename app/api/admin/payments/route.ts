import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const paymentActionSchema = z.object({
  id: z.string().uuid("Invalid payment id"),
  action: z.enum(["activate", "reject"]),
});

export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("payment_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // screenshot_url stores a private-bucket storage path, not a public URL —
  // sign a short-lived viewing link for each row on read.
  const withSignedUrls = await Promise.all((data ?? []).map(async (sub) => {
    if (!sub.screenshot_url) return sub;
    const { data: urlData } = await supabase.storage
      .from("payment-screenshots")
      .createSignedUrl(sub.screenshot_url, 3600);
    return { ...sub, screenshot_url: urlData?.signedUrl ?? null };
  }));

  return NextResponse.json(withSignedUrls);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminUser())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = paymentActionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid action" }, { status: 400 });
  }
  const { id, action } = parsed.data;

  const supabase = createAdminClient();

  const { data: sub, error: fetchErr } = await supabase
    .from("payment_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !sub) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

  const newStatus = action === "activate" ? "activated" : "rejected";

  await supabase
    .from("payment_submissions")
    .update({
      status: newStatus,
      activated_at: action === "activate" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (action === "activate") {
    const expiresAt = sub.plan_id === "all-access"
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    await supabase.from("user_plans").insert({
      clerk_id: sub.clerk_id ?? null,
      email: sub.email,
      plan_id: sub.plan_id,
      plan_name: sub.plan_name,
      expires_at: expiresAt,
    });

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: sub.email,
        subject: `✅ Your StatusClock ${sub.plan_name} is now active!`,
        text: [
          `Hi!`,
          ``,
          `Your ${sub.plan_name} has been activated on StatusClock.`,
          ``,
          `You now have full access to all features included in your plan.`,
          `Log in at https://statusclock-one.vercel.app/dashboard to get started.`,
          ``,
          `Thank you for your purchase!`,
          `— StatusClock Team`,
        ].join("\n"),
      });
    } catch (e) {
      console.error("[activation-email]", e);
    }
  }

  return NextResponse.json({ ok: true });
}
