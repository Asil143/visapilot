import { createAdminClient } from "@/lib/supabase/server";

/** Returns the user's current plan id ("free", or a pack/all-access id). */
export async function getUserPlan(userId: string): Promise<string> {
  const supabase = createAdminClient();

  const { data: plans } = await supabase
    .from("user_plans")
    .select("plan_id, expires_at")
    .eq("clerk_id", userId)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("created_at", { ascending: false })
    .limit(1);

  if (plans && plans.length > 0) return plans[0].plan_id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("clerk_id", userId)
    .single();

  return profile?.subscription_plan ?? "free";
}

const FREE_AI_QUERIES_PER_MONTH = 10;

/**
 * Enforces the free-tier AI question limit advertised on /pricing
 * ("AI Assistant (10 questions/month)"). Paying users (any active pack or
 * all-access) are unlimited. Returns null if the request may proceed, or an
 * error message if the free quota is exhausted.
 */
export async function checkAndConsumeAIQuota(userId: string): Promise<string | null> {
  const plan = await getUserPlan(userId);
  if (plan !== "free") return null; // paid plans are unlimited

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("ai_queries_used_today, ai_queries_reset_at")
    .eq("clerk_id", userId)
    .single();

  const now = new Date();
  let used = profile?.ai_queries_used_today ?? 0;
  let resetAt = profile?.ai_queries_reset_at ? new Date(profile.ai_queries_reset_at) : null;

  if (!resetAt || now >= resetAt) {
    used = 0;
    // Reset on the first day of the next calendar month. Using the same day
    // of the next month breaks for dates such as January 31 (it can normalize
    // into March in JavaScript).
    resetAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  }

  if (used >= FREE_AI_QUERIES_PER_MONTH) {
    return `Free plan limit reached (${FREE_AI_QUERIES_PER_MONTH} AI questions/month). Upgrade at /pricing for unlimited access.`;
  }

  await supabase
    .from("profiles")
    .update({ ai_queries_used_today: used + 1, ai_queries_reset_at: resetAt.toISOString() })
    .eq("clerk_id", userId);

  return null;
}
