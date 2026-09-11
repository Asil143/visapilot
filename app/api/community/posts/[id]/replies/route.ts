import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

const replySchema = z.object({
  body: z.string().trim().min(2, "Reply is too short").max(5000, "Reply is too long"),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("community_replies")
    .select("*")
    .eq("post_id", id)
    .order("is_best_answer", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = replySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid reply" }, { status: 400 });
  }

  const { id } = await params;
  const user = await currentUser();
  const name = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Anonymous";
  const initials = name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2) || "?";

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("community_replies")
    .insert({
      post_id: id,
      user_id: userId,
      author_name: name,
      author_initials: initials,
      body: parsed.data.body,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { count } = await supabase
    .from("community_replies")
    .select("id", { count: "exact", head: true })
    .eq("post_id", id);

  await supabase
    .from("community_posts")
    .update({ replies: count ?? 0 })
    .eq("id", id);

  return NextResponse.json(data, { status: 201 });
}
