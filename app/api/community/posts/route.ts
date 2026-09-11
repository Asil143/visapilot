import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

const postSchema = z.object({
  title: z.string().trim().min(5, "Title is too short").max(180, "Title is too long"),
  body: z.string().trim().min(10, "Body is too short").max(10000, "Body is too long"),
  category: z.string().trim().min(1, "Category is required").max(80, "Category is too long"),
  tags: z.string().max(300, "Tags are too long").optional().default(""),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "hot";

  const supabase = createAdminClient();
  let query = supabase.from("community_posts").select("*");

  if (category !== "all") {
    query = query.eq("category", category);
  }

  if (sort === "new") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "top") {
    query = query.order("replies", { ascending: false });
  } else {
    query = query.order("upvotes", { ascending: false });
  }

  query = query.limit(50);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid post" }, { status: 400 });
  }

  const user = await currentUser();
  const { title, body, category, tags } = parsed.data;

  const name = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Anonymous";

  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const tagArray = tags
    ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      user_id: userId,
      author_name: name,
      author_initials: initials,
      author_visa: "F-1",
      category,
      title,
      body,
      tags: tagArray,
      upvotes: 0,
      replies: 0,
      is_answered: false,
      is_pinned: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
