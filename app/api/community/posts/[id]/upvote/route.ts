import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  // Recording the vote first — the primary key (post_id, clerk_id) rejects
  // a second vote from the same user with a unique-violation (23505).
  const { error: voteError } = await supabase
    .from("community_post_upvotes")
    .insert({ post_id: id, clerk_id: userId });

  if (voteError) {
    if (voteError.code === "23505") {
      return NextResponse.json({ error: "You already upvoted this post" }, { status: 409 });
    }
    return NextResponse.json({ error: voteError.message }, { status: 500 });
  }

  const { error: incrementError } = await supabase.rpc("increment_upvotes", { post_id: id });

  if (incrementError) {
    return NextResponse.json({ error: incrementError.message }, { status: 500 });
  }

  const { data: post, error: fetchErr } = await supabase
    .from("community_posts")
    .select("upvotes")
    .eq("id", id)
    .single();

  if (fetchErr || !post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json({ upvotes: post.upvotes });
}
